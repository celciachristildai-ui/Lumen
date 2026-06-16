/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@lumen.com' },
    update: {},
    create: {
      name: 'Lumen Events Co.',
      email: 'organizer@lumen.com',
      password: hashedPassword,
      role: 'ORGANIZER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@lumen.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'user@lumen.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  const events = [
    {
      title: 'Neon Nights Music Festival',
      description:
        'A two-day electrifying music festival featuring top DJs and live bands across three stages, with food trucks, art installations, and immersive light shows.',
      category: 'Music',
      location: 'Mumbai, India',
      venue: 'Mahalaxmi Race Course',
      date: new Date('2026-08-15'),
      time: '4:00 PM',
      price: 1999,
      capacity: 5000,
      imageUrl:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80',
      featured: true,
    },
    {
      title: 'Future Tech Summit 2026',
      description:
        'Join industry leaders, innovators, and entrepreneurs for a day of insightful talks, product showcases, and networking on the future of AI, Web3, and beyond.',
      category: 'Technology',
      location: 'Bengaluru, India',
      venue: 'KTPO Convention Centre',
      date: new Date('2026-09-10'),
      time: '9:00 AM',
      price: 2499,
      capacity: 1200,
      imageUrl:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      featured: true,
    },
    {
      title: 'Modern Art & Culture Expo',
      description:
        'Explore curated exhibitions from contemporary artists, interactive installations, and live performances celebrating modern art and culture.',
      category: 'Art & Culture',
      location: 'Delhi, India',
      venue: 'India Habitat Centre',
      date: new Date('2026-07-25'),
      time: '11:00 AM',
      price: 499,
      capacity: 800,
      imageUrl:
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80',
      featured: false,
    },
    {
      title: 'Street Food & Flavors Carnival',
      description:
        'A vibrant celebration of street food from across the country, live cooking stations, chef meet-and-greets, and live music all evening.',
      category: 'Food & Drink',
      location: 'Chennai, India',
      venue: 'Marina Beach Grounds',
      date: new Date('2026-07-05'),
      time: '5:00 PM',
      price: 299,
      capacity: 3000,
      imageUrl:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&q=80',
      featured: true,
    },
    {
      title: 'Champions Premier League: Finals Night',
      description:
        'Witness the thrilling finale of the season with the top two teams battling it out for the championship trophy. Live entertainment before kickoff.',
      category: 'Sports',
      location: 'Hyderabad, India',
      venue: 'Rajiv Gandhi International Stadium',
      date: new Date('2026-10-02'),
      time: '7:00 PM',
      price: 999,
      capacity: 40000,
      imageUrl:
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=80',
      featured: false,
    },
    {
      title: 'Startup Pitch Night',
      description:
        'Early-stage startups pitch live to a panel of investors and mentors. Open networking session and refreshments included.',
      category: 'Business',
      location: 'Pune, India',
      venue: 'WeWork Eleven West',
      date: new Date('2026-07-18'),
      time: '6:00 PM',
      price: 0,
      capacity: 200,
      imageUrl:
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&q=80',
      featured: false,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: {
        ...event,
        organizerId: organizer.id,
      },
    });
  }

  console.log('Seed data created successfully.');
  console.log('Demo accounts:');
  console.log('  Organizer -> organizer@lumen.com / password123');
  console.log('  User      -> user@lumen.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
