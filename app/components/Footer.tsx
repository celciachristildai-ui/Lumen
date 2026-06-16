import Link from 'next/link';
import { Sparkles, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-display font-bold text-xl mb-3">
              <Sparkles className="text-accent-500" size={22} />
              <span className="gradient-text">LUMEN</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Discover, book, and experience the best events near you — powered by a smart AI
              assistant to help every step of the way.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/events" className="hover:text-white transition">All Events</Link></li>
              <li><Link href="/events?category=Music" className="hover:text-white transition">Music</Link></li>
              <li><Link href="/events?category=Technology" className="hover:text-white transition">Technology</Link></li>
              <li><Link href="/events?category=Sports" className="hover:text-white transition">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/dashboard" className="hover:text-white transition">My Bookings</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Log in</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Sign up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full glass hover:text-accent-500 transition"><Instagram size={18} /></a>
              <a href="#" className="p-2 rounded-full glass hover:text-accent-500 transition"><Twitter size={18} /></a>
              <a href="#" className="p-2 rounded-full glass hover:text-accent-500 transition"><Facebook size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} LUMEN. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
