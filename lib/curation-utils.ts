import { curationService } from './curation'

/**
 * Trigger content curation for all users
 */
export async function curateAllUsers() {
  try {
    console.log('🚀 Starting feed curation for all users...')
    await curationService.curateForAllUsers()
    console.log('✅ Feed curation completed for all users')
  } catch (error) {
    console.error('💥 Failed to curate feeds:', error)
    throw error
  }
}

/**
 * Trigger content curation for a specific user
 * @param userId The ID of the user to curate content for
 */
export async function curateUserFeed(userId: string) {
  try {
    console.log(`🎯 Starting feed curation for user: ${userId}`)
    await curationService.curateForSingleUser(userId)
    console.log(`✅ Feed curation completed for user: ${userId}`)
  } catch (error) {
    console.error(`💥 Failed to curate feed for user ${userId}:`, error)
    throw error
  }
} 