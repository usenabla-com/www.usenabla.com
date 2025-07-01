import * as cheerio from 'cheerio'

export class RustDocParser {
  constructor() {
    this.docsRsBaseUrl = 'https://docs.rs'
  }

  async extractStructuredData(docText, crateInfo) {
    console.log(`🔍 Extracting structured data for ${crateInfo.name}...`)
    
    try {
      // Try to get structured data from docs.rs HTML first
      const htmlData = await this.parseDocsRsHTML(crateInfo.name, crateInfo.max_version)
      
      // Fallback to text parsing if HTML parsing fails
      const textData = this.parseDocumentationText(docText)
      
      // Merge both sources, preferring HTML data when available
      const keyModules = htmlData.key_modules.length > 0 ? htmlData.key_modules : textData.key_modules
      const importantStructs = htmlData.important_structs.length > 0 ? htmlData.important_structs : textData.important_structs
      const notableFunctions = htmlData.notable_functions.length > 0 ? htmlData.notable_functions : textData.notable_functions
      const traits = htmlData.traits.length > 0 ? htmlData.traits : textData.traits
      
      const structuredData = {
        package_name: crateInfo.name,
        version: crateInfo.max_version,
        key_modules: { modules: keyModules },
        important_structs: { structs: importantStructs },
        notable_functions: { functions: notableFunctions },
        traits: { traits: traits },
        features: this.extractFeatures(crateInfo, docText),
        license: this.extractLicense(crateInfo),
        llm_text: docText
      }
      
      console.log(`✅ Extracted data for ${crateInfo.name}: ${keyModules.length} modules, ${importantStructs.length} structs, ${notableFunctions.length} functions, ${traits.length} traits`)
      
      return structuredData
      
    } catch (error) {
      console.error(`Error extracting structured data for ${crateInfo.name}:`, error.message)
      
      // Return basic structure with text parsing fallback
      return {
        package_name: crateInfo.name,
        version: crateInfo.max_version,
        key_modules: { modules: [] },
        important_structs: { structs: [] },
        notable_functions: { functions: [] },
        traits: { traits: [] },
        features: this.extractFeatures(crateInfo, docText),
        license: this.extractLicense(crateInfo),
        llm_text: docText
      }
    }
  }

  async parseDocsRsHTML(crateName, version) {
    const normalizedName = crateName.replace(/-/g, '_')
    const url = `${this.docsRsBaseUrl}/${crateName}/${version}/${normalizedName}/`
    
    try {
      console.log(`🌐 Fetching HTML from ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'rustoleum-crawler/1.0'
        },
        timeout: 30000
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const html = await response.text()
      const $ = cheerio.load(html)
      
      return {
        key_modules: this.extractModules($),
        important_structs: this.extractStructs($),
        notable_functions: this.extractFunctions($),
        traits: this.extractTraits($)
      }
      
    } catch (error) {
      console.log(`⚠️  Failed to parse docs.rs HTML for ${crateName}: ${error.message}`)
      return {
        key_modules: [],
        important_structs: [],
        notable_functions: [],
        traits: []
      }
    }
  }

  extractModules($) {
    const modules = []
    
    // Debug: Let's see what's actually in the page
    console.log('🔍 Looking for modules in HTML...')
    
    // Try multiple selectors for modules
    const selectors = [
      '.item-table .item-name a[href*="/mod."]',
      '.item-table .item-name a[href*="mod."]', 
      '.docblock .item-name a[href*="mod."]',
      '.item-left.module-item a',
      '.summary .module-item a',
      'a[href*="mod."]'
    ]
    
    for (const selector of selectors) {
      const elements = $(selector)
      console.log(`  Selector "${selector}": found ${elements.length} elements`)
      
      elements.each((i, el) => {
        const $el = $(el)
        const href = $el.attr('href')
        const name = $el.text().trim()
        const description = $el.closest('tr').find('.item-desc, .desc').text().trim()
        
        if (name && href && href.includes('mod.') && !modules.find(m => m.name === name)) {
          modules.push({
            name: name.replace(/^mod\s+/, ''),
            description: description || '',
            href: href
          })
          console.log(`    Found module: ${name}`)
        }
      })
      
      if (modules.length > 0) break // Stop if we found modules
    }
    
    // Fallback: Look for section headers that mention modules
    if (modules.length === 0) {
      console.log('🔍 Trying fallback: looking for module sections...')
      
      $('h2, h3').each((i, el) => {
        const $el = $(el)
        const text = $el.text().toLowerCase()
        if (text.includes('module') && modules.length < 10) {
          const nextSibling = $el.next()
          if (nextSibling.length > 0) {
            nextSibling.find('a').each((j, link) => {
              const $link = $(link)
              const name = $link.text().trim()
              const href = $link.attr('href')
              if (name && href && !modules.find(m => m.name === name)) {
                modules.push({
                  name,
                  description: '',
                  href: href
                })
                console.log(`    Found module from section: ${name}`)
              }
            })
          }
        }
      })
    }
    
    console.log(`✅ Total modules found: ${modules.length}`)
    return modules.slice(0, 20) // Limit to top 20
  }

  extractStructs($) {
    const structs = []
    
    console.log('🔍 Looking for structs in HTML...')
    
    // Try multiple selectors for structs
    const selectors = [
      '.item-table .item-name a[href*="/struct."]',
      '.item-table .item-name a[href*="struct."]',
      '.docblock .item-name a[href*="struct."]',
      '.item-left.struct-item a',
      '.summary .struct-item a',
      'a[href*="struct."]'
    ]
    
    for (const selector of selectors) {
      const elements = $(selector)
      console.log(`  Selector "${selector}": found ${elements.length} elements`)
      
      elements.each((i, el) => {
        const $el = $(el)
        const href = $el.attr('href')
        const name = $el.text().trim()
        
        // Skip if it's actually a method (contains #method)
        if (href && href.includes('#method')) {
          return
        }
        
        // Skip if it contains :: and looks like a path rather than a struct name
        const cleanName = name.replace(/^struct\s+/, '')
        if (cleanName.includes('::') && cleanName.split('::').length > 2) {
          return
        }
        
        // Try to get description from nearby elements
        let description = ''
        const row = $el.closest('tr')
        if (row.length > 0) {
          description = row.find('.item-desc, .desc, td:last-child').text().trim()
        }
        
        // Fallback: look for description in parent elements
        if (!description) {
          const parent = $el.parent()
          description = parent.siblings('.desc, .description').text().trim()
        }
        
        if (cleanName && href && href.includes('struct.') && !structs.find(s => s.name === cleanName)) {
          structs.push({
            name: cleanName,
            description: description || '',
            href: href,
            // Remove fields since they're not available on main pages
            // and most structs have private fields anyway
            visibility: href.includes('/struct.') ? 'public' : 'unknown'
          })
          console.log(`    Found struct: ${cleanName}${description ? ' - ' + description.slice(0, 50) + '...' : ''}`)
        }
      })
      
      if (structs.length > 0) break
    }
    
    console.log(`✅ Total structs found: ${structs.length}`)
    return structs.slice(0, 30) // Limit to top 30
  }

  extractFunctions($) {
    const functions = []
    
    console.log('🔍 Looking for functions in HTML...')
    
    // Try multiple selectors for functions
    const selectors = [
      '.item-table .item-name a[href*="/fn."]',
      '.item-table .item-name a[href*="fn."]',
      '.docblock .item-name a[href*="fn."]',
      '.item-left.function-item a',
      '.summary .function-item a',
      'a[href*="fn."]'
    ]
    
    for (const selector of selectors) {
      const elements = $(selector)
      console.log(`  Selector "${selector}": found ${elements.length} elements`)
      
      elements.each((i, el) => {
        const $el = $(el)
        const href = $el.attr('href')
        const name = $el.text().trim()
        
        const cleanName = name.replace(/^fn\s+/, '')
        
        // Try to get description from nearby elements
        let description = ''
        const row = $el.closest('tr')
        if (row.length > 0) {
          description = row.find('.item-desc, .desc, td:last-child').text().trim()
        }
        
        // Fallback: look for description in parent elements
        if (!description) {
          const parent = $el.parent()
          description = parent.siblings('.desc, .description').text().trim()
        }
        
        if (cleanName && href && href.includes('fn.') && !functions.find(f => f.name === cleanName)) {
          functions.push({
            name: cleanName,
            description: description || '',
            href: href,
            // Remove signature since it's not available on main pages
            // and would require individual page scraping
            module: this.extractModuleFromHref(href)
          })
          console.log(`    Found function: ${cleanName}${description ? ' - ' + description.slice(0, 50) + '...' : ''}`)
        }
      })
      
      if (functions.length > 0) break
    }
    
    console.log(`✅ Total functions found: ${functions.length}`)
    return functions.slice(0, 50) // Limit to top 50
  }

  extractTraits($) {
    const traits = []
    
    console.log('🔍 Looking for traits in HTML...')
    
    // Try multiple selectors for traits
    const selectors = [
      '.item-table .item-name a[href*="/trait."]',
      '.item-table .item-name a[href*="trait."]',
      '.docblock .item-name a[href*="trait."]',
      '.item-left.trait-item a',
      '.summary .trait-item a',
      'a[href*="trait."]'
    ]
    
    for (const selector of selectors) {
      const elements = $(selector)
      console.log(`  Selector "${selector}": found ${elements.length} elements`)
      
      elements.each((i, el) => {
        const $el = $(el)
        const href = $el.attr('href')
        const name = $el.text().trim()
        
        const cleanName = name.replace(/^trait\s+/, '')
        
        // Try to get description from nearby elements
        let description = ''
        const row = $el.closest('tr')
        if (row.length > 0) {
          description = row.find('.item-desc, .desc, td:last-child').text().trim()
        }
        
        // Fallback: look for description in parent elements
        if (!description) {
          const parent = $el.parent()
          description = parent.siblings('.desc, .description').text().trim()
        }
        
        if (cleanName && href && href.includes('trait.') && !traits.find(t => t.name === cleanName)) {
          traits.push({
            name: cleanName,
            description: description || '',
            href: href,
            // Remove methods since they're not available on main pages
            // and would require individual page scraping
            module: this.extractModuleFromHref(href)
          })
          console.log(`    Found trait: ${cleanName}${description ? ' - ' + description.slice(0, 50) + '...' : ''}`)
        }
      })
      
      if (traits.length > 0) break
    }
    
    console.log(`✅ Total traits found: ${traits.length}`)
    return traits.slice(0, 20) // Limit to top 20
  }

  parseDocumentationText(docText) {
    // Fallback text parsing using regex patterns
    const modules = this.extractModulesFromText(docText)
    const structs = this.extractStructsFromText(docText)
    const functions = this.extractFunctionsFromText(docText)
    const traits = this.extractTraitsFromText(docText)
    
    return {
      key_modules: modules,
      important_structs: structs,
      notable_functions: functions,
      traits: traits
    }
  }

  extractModulesFromText(text) {
    const modules = []
    const moduleRegex = /^##?\s+Module\s+`?([^`\n]+)`?/gim
    let match
    
    while ((match = moduleRegex.exec(text)) !== null) {
      const name = match[1].trim()
      if (name && !modules.find(m => m.name === name)) {
        modules.push({
          name,
          description: this.extractDescriptionAfterHeading(text, match.index)
        })
      }
    }
    
    return modules.slice(0, 20)
  }

  extractStructsFromText(text) {
    const structs = []
    const structRegex = /^##?\s+Struct\s+`?([^`\n]+)`?|pub struct\s+([A-Z][A-Za-z0-9_]*)/gim
    let match
    
    while ((match = structRegex.exec(text)) !== null) {
      const name = (match[1] || match[2] || '').trim()
      if (name && !structs.find(s => s.name === name)) {
        structs.push({
          name,
          description: this.extractDescriptionAfterHeading(text, match.index),
          fields: []
        })
      }
    }
    
    return structs.slice(0, 30)
  }

  extractFunctionsFromText(text) {
    const functions = []
    const functionRegex = /^##?\s+Function\s+`?([^`\n]+)`?|pub fn\s+([a-z_][a-z0-9_]*)/gim
    let match
    
    while ((match = functionRegex.exec(text)) !== null) {
      const name = (match[1] || match[2] || '').trim()
      if (name && !functions.find(f => f.name === name)) {
        functions.push({
          name,
          description: this.extractDescriptionAfterHeading(text, match.index),
          signature: ''
        })
      }
    }
    
    return functions.slice(0, 50)
  }

  extractTraitsFromText(text) {
    const traits = []
    const traitRegex = /^##?\s+Trait\s+`?([^`\n]+)`?|pub trait\s+([A-Z][A-Za-z0-9_]*)/gim
    let match
    
    while ((match = traitRegex.exec(text)) !== null) {
      const name = (match[1] || match[2] || '').trim()
      if (name && !traits.find(t => t.name === name)) {
        traits.push({
          name,
          description: this.extractDescriptionAfterHeading(text, match.index),
          methods: []
        })
      }
    }
    
    return traits.slice(0, 20)
  }

  extractDescriptionAfterHeading(text, startIndex) {
    const lines = text.slice(startIndex).split('\n')
    const descriptionLines = []
    
    // Skip the heading line
    for (let i = 1; i < lines.length && i < 5; i++) {
      const line = lines[i].trim()
      if (line && !line.startsWith('#') && !line.startsWith('```')) {
        descriptionLines.push(line)
      } else if (descriptionLines.length > 0) {
        break
      }
    }
    
    return descriptionLines.join(' ').slice(0, 200) // Limit description length
  }

  extractFeatures(crateInfo, docText) {
    const features = []
    
    // Add keywords from crate info
    if (crateInfo.keywords && Array.isArray(crateInfo.keywords)) {
      features.push(...crateInfo.keywords)
    }
    
    // Add categories as features
    if (crateInfo.categories && Array.isArray(crateInfo.categories)) {
      features.push(...crateInfo.categories)
    }
    
    // Extract features from documentation
    const featureRegex = /feature\s*=\s*["']([^"']+)["']/gi
    let match
    while ((match = featureRegex.exec(docText)) !== null) {
      const feature = match[1].trim()
      if (feature && !features.includes(feature)) {
        features.push(feature)
      }
    }
    
    return [...new Set(features)].slice(0, 20) // Remove duplicates and limit
  }

  extractLicense(crateInfo) {
    if (crateInfo.license) {
      return crateInfo.license
    }
    
    // Common license patterns
    const commonLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0', 'ISC']
    
    if (crateInfo.description) {
      for (const license of commonLicenses) {
        if (crateInfo.description.toLowerCase().includes(license.toLowerCase())) {
          return license
        }
      }
    }
    
    return 'Unknown'
  }

  extractModuleFromHref(href) {
    if (!href) return 'root'
    
    // Extract module from href like "sync/struct.Mutex.html" -> "sync"
    const parts = href.split('/')
    if (parts.length > 1 && !parts[0].includes('.html')) {
      return parts[0]
    }
    
    return 'root'
  }
} 