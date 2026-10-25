import './globals.css';

export const metadata = {
  title: 'Itinera — Curated Travel Itinerary & Field Planner',
  description: 'Bespoke, human-centered travel itineraries and daily field dossiers tailored to your travel companions and budget.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#FAF7F0] text-[#162842] selection:bg-[#FAECE8] selection:text-[#E05A3A]">
        {children}
      </body>
    </html>
  );
}
