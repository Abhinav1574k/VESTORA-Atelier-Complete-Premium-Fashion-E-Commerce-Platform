import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartDrawer from '@/components/common/CartDrawer';
import QuickViewModal from '@/components/common/QuickViewModal';
import FashionAssistantModal from '@/components/common/FashionAssistantModal';
import ToastContainer from '@/components/common/ToastContainer';

export const metadata: Metadata = {
  title: 'VESTORA | Haute Couture & Sartorial Fashion Atelier',
  description:
    'Experience verified quiet luxury with VESTORA. Spun from certified 22-Momme Mulberry Silk, 120s Egyptian Giza Cotton, and Super 130s Merino Wool. Honest GSM transparency, side-by-side garment comparison, and pan-India white-glove courier.',
  keywords: [
    'VESTORA',
    'luxury fashion',
    'mulberry silk dress',
    'giza cotton shirt',
    'selvedge raw denim',
    'merino wool trousers',
    'haute couture India',
    'handloom ethnic wear',
    'fabric GSM comparison',
  ],
  authors: [{ name: 'VESTORA Atelier' }],
  openGraph: {
    title: 'VESTORA | Luxury Haute Couture & Sartorial Fashion Atelier',
    description: 'Quiet luxury tailored from verified natural fibers. Honest GSM transparency and artisan craftsmanship.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#FCFBF9] text-[#181817] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-vestora-gold selection:text-vestora-jet">
        <StoreProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />

          {/* Interactive Global Drawers & Modals */}
          <CartDrawer />
          <QuickViewModal />
          <FashionAssistantModal />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
