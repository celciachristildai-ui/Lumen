import type { Metadata } from 'next';
import './../styles/globals.css';
import Providers from './providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';

export const metadata: Metadata = {
  title: 'LUMEN | Discover & Book Unforgettable Events',
  description:
    'LUMEN is a modern event booking platform — discover concerts, festivals, conferences and more, book instantly, and get help from our AI assistant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
