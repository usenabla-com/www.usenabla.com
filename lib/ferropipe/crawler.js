import { createClient } from '@clickhouse/client'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'
import { RustDocParser } from './parser.js'
import { RustApiClient } from './api-client.js'

export class ferropipeCrawler {
  constructor(options = {}) {
    this.clickhouse = createClient({
      url: options.clickhouseHost || 'http://localhost:8123',
      database: options.database || 'default',
      username: options.username,
      password: options.password
    })
    
    this.parser = new RustDocParser()
    this.apiClient = new RustApiClient()
    this.concurrency = options.concurrency || 5
    this.outputDir = options.outputDir || './llms-full'
    
    // Ensure output directory exists
    this.ensureOutputDir()
  }

  async ensureOutputDir() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true })
    } catch (error) {
      console.error('Failed to create output directory:', error)
    }
  }

  async crawlTop1000Packages() {
    console.log('🚀 Starting crawl of top 1000 Rust packages...')
    
    try {
      // Get top 1000 most popular packages
      const packages = await this.apiClient.getTopPackages(1000)
      console.log(`📦 Found ${packages.length} packages to process`)
      
      // Process packages in batches to avoid overwhelming the system
      const batchSize = this.concurrency
      const batches = this.chunkArray(packages, batchSize)
      
      let processed = 0
      let successful = 0
      let failed = 0
      
      for (const batch of batches) {
        console.log(`\n📊 Processing batch ${Math.floor(processed / batchSize) + 1}/${batches.length}`)
        
        const promises = batch.map(pkg => this.processPackage(pkg))
        const results = await Promise.allSettled(promises)
        
        results.forEach((result, index) => {
          const pkg = batch[index]
          if (result.status === 'fulfilled') {
            successful++
            console.log(`✅ Successfully processed ${pkg.name}`)
          } else {
            failed++
            console.error(`❌ Failed to process ${pkg.name}:`, result.reason?.message || result.reason)
          }
        })
        
        processed += batch.length
        console.log(`📈 Progress: ${processed}/${packages.length} (${successful} successful, ${failed} failed)`)
        
        // Small delay between batches to be respectful
        await this.sleep(1000)
      }
      
      console.log(`\n🎉 Crawling complete! ${successful}/${packages.length} packages processed successfully`)
      
    } catch (error) {
      console.error('❌ Crawling failed:', error)
      throw error
    }
  }

  async processPackage(pkg) {
    const startTime = Date.now()
    console.log(`🔍 Processing ${pkg.name} v${pkg.max_version}...`)
    
    try {
      // Check if already processed
      const exists = await this.checkIfExists(pkg.name, pkg.max_version)
      if (exists) {
        console.log(`⏭️  Skipping ${pkg.name} - already exists`)
        return
      }
      
      // Get documentation text using rustdoc-text
      const docText = await this.getDocumentationText(pkg.name)
      
      if (!docText || docText.trim().length === 0) {
        throw new Error('No documentation text retrieved')
      }
      
      // Extract structured data
      const structuredData = await this.parser.extractStructuredData(docText, pkg)
      
      // Insert into ClickHouse
      await this.insertIntoClickHouse(structuredData)
      
      // Create llms-full.txt file
      await this.createLLMFullFile(pkg.name, docText)
      
      const duration = Date.now() - startTime
      console.log(`✨ Completed ${pkg.name} in ${duration}ms`)
      
    } catch (error) {
      console.error(`💥 Error processing ${pkg.name}:`, error.message)
      throw error
    }
  }

  async checkIfExists(packageName, version) {
    try {
      const result = await this.clickhouse.query({
        query: 'SELECT COUNT(*) as count FROM packages WHERE package_name = {packageName:String} AND version = {version:String}',
        query_params: { packageName, version }
      })
      
      const rows = await result.json()
      return rows.data[0].count > 0
    } catch (error) {
      console.error(`Error checking if ${packageName} exists:`, error)
      return false
    }
  }

  async getDocumentationText(crateName) {
    return new Promise((resolve, reject) => {
      console.log(`📚 Fetching docs for ${crateName}...`)
      
      const process = spawn('rustdoc-text', ['--online', crateName], {
        timeout: 60000 // 60 second timeout
      })
      
      let output = ''
      let errorOutput = ''
      
      process.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(output)
        } else {
          reject(new Error(`rustdoc-text failed with code ${code}: ${errorOutput}`))
        }
      })
      
      process.on('error', (error) => {
        reject(new Error(`Failed to spawn rustdoc-text: ${error.message}`))
      })
    })
  }

  async insertIntoClickHouse(data) {
    try {
      // Debug: Log the data being inserted
      console.log('🔍 Inserting data:', {
        package_name: data.package_name,
        version: data.version,
        key_modules_type: typeof data.key_modules,
        key_modules_keys: Object.keys(data.key_modules || {}),
        features_length: data.features?.length
      })
      
      await this.clickhouse.insert({
        table: 'packages',
        values: [data],
        format: 'JSONEachRow'
      })
      
      console.log(`✅ Successfully inserted ${data.package_name} into ClickHouse`)
      
    } catch (error) {
      console.error('ClickHouse insertion error:', error)
      console.error('🔍 Failed data:', JSON.stringify(data, null, 2))
      throw error
    }
  }

  async createLLMFullFile(crateName, docText) {
    try {
      const filename = path.join(this.outputDir, `${crateName}.txt`)
      await fs.writeFile(filename, docText, 'utf8')
    } catch (error) {
      console.error(`Failed to write LLM file for ${crateName}:`, error)
      // Don't throw - this is not critical
    }
  }

  chunkArray(array, size) {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async testConnection() {
    try {
      const result = await this.clickhouse.query({ query: 'SELECT 1' })
      console.log('✅ ClickHouse connection successful')
      return true
    } catch (error) {
      console.error('❌ ClickHouse connection failed:', error)
      return false
    }
  }
} 