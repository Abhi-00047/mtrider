'use client'
import { useRouter } from 'next/navigation'

export default function AuthError() {
  const router = useRouter()
  return (
    <div style={{
      background: '#050709',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#00d4ff' }}>Auth Failed</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Something went wrong with Google login
      </p>
      <button
        onClick={() => router.push('/')}
        style={{
          background: 'rgba(0,212,255,0.1)',
          border: '1px solid rgba(0,212,255,0.3)',
          color: '#00d4ff',
          padding: '12px 24px',
          borderRadius: 12,
          cursor: 'pointer'
        }}
      >
        Try Again
      </button>
    </div>
  )
}
