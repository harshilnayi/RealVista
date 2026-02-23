import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata = {
  title: 'RealVista - Find Your Dream Property',
  description:
    'RealVista is a modern real estate platform to buy, sell, or rent properties. Browse thousands of listings, connect with agents, and find your perfect home.',
  keywords: 'real estate, property, buy, sell, rent, house, apartment, villa, India',
  openGraph: {
    title: 'RealVista - Find Your Dream Property',
    description: 'Modern real estate platform to buy, sell, or rent properties',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Navbar />
          <main className="page">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
