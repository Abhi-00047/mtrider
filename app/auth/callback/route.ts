import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('--- CALLBACK START ---')
  console.log('Code present:', !!code)
  
  if (code) {
    const cookieStore = await cookies()
    
    // Debug ENV variables (masked)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING'
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'MISSING'
    console.log('Supabase URL:', url)
    console.log('Anon Key found:', key !== 'MISSING')

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (err) {
              console.error('Error setting cookies in setAll:', err)
            }
          },
        },
      }
    )

    console.log('Exchanging code for session...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('EXCHANGE ERROR:', error.message)
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }

    console.log('Exchange successful for:', data.user?.email)
    // Redirect to root route instead of /dashboard as requested
    return NextResponse.redirect(`${origin}/`)
  }

  console.log('No code found in callback URL')
  return NextResponse.redirect(`${origin}/`)
}
