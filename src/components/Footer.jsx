'use client';

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="mt-20 border-t border-[#E8E1D5] bg-[#F7F4EC] text-[#526685] no-print">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm tracking-wider font-semibold text-[#162842] uppercase">
            Itinera
          </span>
          <span className="text-[#A0B3CC]">/</span>
          <span className="text-[11px] text-[#526685]">
            Curated Field Dossiers &amp; Itinerary Planner
          </span>
        </div>

        {/* Legal & Trust Anchors */}
        <div className="flex items-center gap-4 text-[11px]">
          <button
            onClick={() => onOpenLegal('terms')}
            className="hover:text-[#E05A3A] transition-colors underline-offset-4 hover:underline"
          >
            Terms of Service
          </button>
          <span className="text-[#DFD8C8]">•</span>
          <button
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-[#E05A3A] transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </button>
          <span className="text-[#DFD8C8]">•</span>
          <span className="text-[#526685]">
            &copy; {new Date().getFullYear()} Itinera
          </span>
        </div>
      </div>
    </footer>
  );
}
