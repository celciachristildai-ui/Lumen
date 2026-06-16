'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Sparkles, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <Sparkles className="text-accent-500" size={24} />
            <span className="gradient-text">LUMEN</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Home
            </Link>
            <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Explore Events
            </Link>
            {session && (
              <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition">
                My Bookings
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  <LayoutDashboard size={18} />
                  {session.user?.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-accent-500 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-300 hover:text-white transition"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3 animate-fade-in">
            <Link href="/" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/events" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
              Explore Events
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white flex items-center gap-2">
                  <User size={16} /> My Bookings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-left text-gray-400 hover:text-accent-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-gray-300 hover:text-white">
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full text-white text-center"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
