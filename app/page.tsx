import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Bot } from 'lucide-react';
import EventCard from './components/EventCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

async function getFeaturedEvents() {
  try {
    return await prisma.event.findMany({
      where: { featured: true },
      orderBy: { date: 'asc' },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await getFeaturedEvents();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium text-primary-300 mb-6 animate-fade-in">
            <Sparkles size={14} /> Now with AI-powered event recommendations
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight animate-slide-up">
            Find Your Next
            <br />
            <span className="gradient-text">Unforgettable Experience</span>
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto animate-slide-up">
            Discover concerts, conferences, festivals, and more. Book in seconds and let our AI
            assistant guide you every step of the way.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/events"
              className="btn-primary text-white font-semibold px-8 py-3.5 rounded-full flex items-center justify-center gap-2"
            >
              Explore Events <ArrowRight size={18} />
            </Link>
            <Link
              href="/register"
              className="glass text-white font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass rounded-2xl p-6">
            <div className="bg-primary-600/20 text-primary-300 p-3 rounded-xl inline-flex mb-4">
              <Zap size={22} />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">Instant Booking</h3>
            <p className="text-gray-400 text-sm">
              Reserve your spot in seconds with a secure, streamlined checkout experience.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="bg-accent-500/20 text-accent-400 p-3 rounded-xl inline-flex mb-4">
              <Bot size={22} />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">AI Assistant</h3>
            <p className="text-gray-400 text-sm">
              Get personalized event recommendations and instant answers from LUMEN AI, 24/7.
            </p>
          </div>
          <div className="glass rounded-2xl p-6">
            <div className="bg-primary-600/20 text-primary-300 p-3 rounded-xl inline-flex mb-4">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">Secure & Reliable</h3>
            <p className="text-gray-400 text-sm">
              Your data and payments are protected with industry-standard encryption.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-3xl mb-2">Featured Events</h2>
            <p className="text-gray-400">Hand-picked experiences happening soon</p>
          </div>
          <Link
            href="/events"
            className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-gray-400">
            No events yet. Run <code className="text-primary-300">npm run db:seed</code> to load
            sample events, or check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                category={event.category}
                location={event.location}
                date={event.date}
                price={event.price}
                imageUrl={event.imageUrl}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-hero-gradient rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-white">
            Hosting an event?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Reach thousands of attendees and manage bookings effortlessly with LUMEN's organizer
            tools.
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-full inline-flex items-center gap-2 hover:bg-gray-100 transition"
          >
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
