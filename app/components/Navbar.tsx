'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, Settings, Plus, User } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <Sparkles className="text-accent-500" size={24} />
            <span className="gradient-text">LUMEN</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition">Home</Link>
            <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition">Explore Events</Link>
            <Link href="/host-event" className="text-sm font-medium text-gray-300 hover:text-white transition">Host an Event</Link>
            {session && (
              <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition">My Bookings</Link>
            )}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2 glass px-3 py-2 rounded-full hover:bg-white/10 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-600/40 flex items-center justify-center text-xs font-bold text-primary-300">
                    {(session.user?.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-300 max-w-[100px] truncate">{session.user?.name}</span>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-12 w-48 glass rounded-2xl shadow-2xl py-2 z-50 animate-fade-in border border-white/10">
                    <Link href="/dashboard" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                      <LayoutDashboard size={15} /> My Bookings
                    </Link>
                    <Link href="/host-event" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                      <Plus size={15} /> Host an Event
                    </Link>
                    <Link href="/settings" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition">
                      <Settings size={15} /> Settings
                    </Link>
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 w-full transition">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">Log in</Link>
                <Link href="/register" className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full text-white">Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 animate-fade-in border-t border-white/5 pt-4">
            <Link href="/" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/events" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">Explore Events</Link>
            <Link href="/host-event" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white flex items-center gap-2"><Plus size={15} /> Host an Event</Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white flex items-center gap-2"><LayoutDashboard size={15} /> My Bookings</Link>
                <Link href="/settings" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white flex items-center gap-2"><Settings size={15} /> Settings</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left text-red-400 hover:text-red-300 flex items-center gap-2"><LogOut size={15} /> Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">Log in</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full text-white text-center">Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Close dropdown on outside click */}
      {dropOpen && <div className="fixed inset-0 z-40" onClick={() => setDropOpen(false)} />}
    </header>
  );
}
