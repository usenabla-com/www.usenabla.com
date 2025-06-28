'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import supabase, { UserProfile } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, DollarSign, Clock, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PortalProfilePage () {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Prefer ?handle= query string, fall back to dynamic segment
  const handleParam = searchParams?.get('handle') as string | null
  const routehandle = params?.handle as string | undefined
  const handle = handleParam || routehandle || null

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function loadProfile () {
      if (!handle) {
        setError('No handle provided')
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase.supabase
          .from('users')
          .select('*')
          .eq('handle', handle)
          .maybeSingle()
        if (error) throw error
        setProfile(data as any)
        if (data) {
          // Load transactions for this user
          const { data: txData } = await supabase.supabase
            .from('transactions')
            .select('*')
            .eq('user_id', data.id)
            .order('created_at', { ascending: false })
          setTransactions(txData || [])
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [handle])

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4' />
          <p className='text-gray-600'>Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className='min-h-screen bg-gray-50 flex flex-col'>
        <div className='flex-1 flex items-center justify-center px-4'>
          <div className='bg-white rounded-lg border border-gray-200 p-12 text-center'>
            <h2 className='text-2xl font-bold text-red-600 mb-4'>Profile Not Found</h2>
            <p className='text-gray-600'>{error || 'The requested profile could not be found.'}</p>
          </div>
        </div>
      </div>
    )
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim()

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <main className='flex-1 container mx-auto px-4 py-10 max-w-4xl'>
        {/* Back Navigation */}
        <div className='mb-6'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium'
          >
            <ArrowLeft className='h-4 w-4' /> Back
          </button>
        </div>

        <div className='bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-8'>
          {/* Avatar */}
          <div className='flex-shrink-0'>
            <div className='relative w-40 h-40 rounded-xl overflow-hidden bg-gray-100'>
              <Image
                src={profile.profile_pic || '/placeholder-user.jpg'}
                alt={fullName || profile.handle}
                fill
                className='object-cover'
              />
            </div>
          </div>

          {/* Info */}
          <div className='flex-1 space-y-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>{fullName || profile.handle}</h1>
              {profile.headline && <p className='text-gray-600 mt-1'>{profile.headline}</p>}
              {profile.status && <p className='text-sm text-gray-500 italic mt-1'>"{profile.status}"</p>}
            </div>

            <div className='flex flex-wrap gap-4'>
              {profile.city && (
                <Badge variant='secondary' className='gap-1'>
                  <MapPin className='h-4 w-4' /> {profile.city}
                </Badge>
              )}
              <Badge variant='secondary' className='gap-1'>
                <Users className='h-4 w-4' /> Member
              </Badge>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className='mt-10'>
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Transaction History</h2>
          {transactions.length === 0 ? (
            <p className='text-gray-500'>No transactions yet.</p>
          ) : (
            <div className='space-y-4'>
              {transactions.map(tx => (
                <div key={tx.id} className='bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between'>
                  <div>
                    <p className='font-medium text-gray-900'>{tx.denomination}</p>
                    <p className='text-sm text-gray-500'>{tx.ctx?.description ?? '—'}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-gray-900 font-semibold'>{new Date(tx.created_at).toLocaleDateString()}</p>
                    {tx.spent_at && (
                      <p className='text-xs text-gray-500 flex items-center justify-end gap-1'><Clock className='h-3 w-3' /> {new Date(tx.spent_at).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
