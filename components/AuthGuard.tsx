'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signInWithGoogle } from '@/lib/auth';
import { motion } from 'framer-motion';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050709]">
        <div className="w-12 h-12 border-2 border-[#3ddc84]/20 border-t-[#3ddc84] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050709] font-['Barlow_Condensed'] overflow-hidden">
        {/* Subtle MT-15 Atmosphere Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00d4ff]/05 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#3ddc84]/05 blur-[150px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center max-w-sm w-full px-6"
        >
          {/* Logo / App Name */}
          <h1 className="text-6xl font-black tracking-tighter text-white mb-2 leading-none">
            MT RIDER
          </h1>
          <p className="text-[#3ddc84] text-sm tracking-[0.3em] font-medium mb-12 uppercase italic">
            Daily Discipline. Every Ride.
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 px-6 py-[14px] bg-white/[0.04] border border-white/10 rounded-[12px] backdrop-blur-[20px] text-white font-semibold transition-all hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(0,212,255,0.1)] group active:scale-[0.98]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm">Continue with Google</span>
          </button>

          <p className="mt-8 text-[11px] text-[#444] tracking-wide">
            Your data stays private. Always.
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
