# 🚀 Itinera AI — Smart AI Travel Planner

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-Flash_2.5/3.5-4285F4?logo=google)](https://aistudio.google.com/)
[![Deployment](https://img.shields.io/badge/Vercel-Production-000000?logo=vercel)](https://itinera-ai-planner.vercel.app/)

> **Itinera AI** is an interactive, intelligent travel itinerary generator. Powered by the official Google Gemini Flash API, it crafts custom day-by-day travel schedules tailored to your destination, travel companions, and budget preferences in seconds.

---

## 🌐 Live Demo & Repository

- **Live Application**: [https://itinera-ai-planner.vercel.app/](https://itinera-ai-planner.vercel.app/)
- **GitHub Repository**: [https://github.com/Ayush-Tummalapalli/itenera_ai.git](https://github.com/Ayush-Tummalapalli/itenera_ai.git)

---

## ✨ Key Features

1. **🤖 Structured Google Gemini AI Engine**:
   - High-speed travel itinerary generation via official Google AI Studio API (`gemini-flash-lite-latest`).
   - Generates strict JSON schema rendered into interactive React components (expand/collapse activity details, reorder stops `↑/↓`, delete stops, or add custom activities).
2. **🗺️ Interactive Geographic Route Map**:
   - Integrated OpenStreetMap / Leaflet view featuring daily numbered pins, sequence connection trails, day filter tabs, and 1-click turn-by-turn route directions directly in Google Maps.
3. **📅 1-Click iCalendar (.ics) Sync**:
   - Export your entire schedule to RFC 5545 `.ics` format with customizable start date, automatic stop time calculations, event locations, descriptions, and universal compatibility with Google Calendar, Apple Calendar, and Outlook.
4. **💬 24/7 AI Travel Concierge Assistant**:
   - Floating interactive travel advisor drawer providing destination Q&A, local etiquette, phrasebook pronunciations, dietary guidance, and emergency safety advice powered by Google Gemini with an offline fallback engine.
5. **💵 Real-Time Budget & Expense Ledger**:
   - Track actual spending vs. estimated budget per category (Stay, Food, Activities, Transit, Shopping, Misc) with remaining balance alerts, visual burn rate progress bar, quick presets, and 1-click CSV export.
6. **⚙️ Advanced Trip Customization & Preferences**:
   - Filter itineraries by Travel Rhythm/Pace (`Relaxed`, `Balanced`, `Packed`), Dietary Constraints (`Vegetarian`, `Vegan`, `Halal`, `Gluten-Free`), and Core Interest tags (`History`, `Street Food`, `Nature`, `Photography`, `Nightlife`, `Hidden Gems`).
7. **👥 Travel Companion Personalization**:
   - Tailors activities and pace based on companion filters: `Solo Traveler`, `Couple / Romantic`, `Family with Kids`, and `Group of Friends`.
8. **💰 Per-Pax Budget Breakdown & Smart Alerts**:
   - Calculates estimated cost per person and breaks down expenses into Stay, Food, and Activities.
   - Automatically flags unrealistically low budgets with a helpful minimum recommended threshold notice.
9. **💱 Real-Time Multi-Currency Converter**:
   - Instant real-time toggle between **USD ($)**, **INR (₹)**, and **EUR (€)** across total budgets, breakdown charts, expense trackers, and individual activity cost tags.
10. **📊 Interactive SVG Donut Budget Chart**:
    - Responsive SVG Donut chart displaying cost proportions with interactive segment hover states.
11. **🎒 Interactive AI Packing Checklist**:
    - Destination-tailored packing lists (Documents, Clothing, Electronics, Essentials) with check-off progress tracking and custom item management.
12. **🗺️ Clickable Google Maps & Weather Advisor**:
    - Activity locations link directly to Google Maps search. Includes Best Season, Average Temp, and Packing advice cards.
13. **📄 Export PDF & WhatsApp Sharing**:
    - `@media print` optimized PDF exporter and 1-click Markdown summary copier for WhatsApp and text messaging.
14. **💾 Session Saving & Persistence (`localStorage`)**:
    - Save trips locally and manage past sessions via the "My Saved Trips" slide-out drawer.
15. **⚡ Preset Quick Demos**:
    - Instant demo loader for instant 0ms exploration (Tokyo, Paris, Goa, Rome).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router, JavaScript), React 18, Tailwind CSS, Lucide Icons.
- **Backend / API**: Next.js Serverless API Routes (`/api/generate` & `/api/refine`).
- **AI Engine**: Official Google Gemini API (`GEMINI_API_KEY`) via high-speed REST endpoints.
- **State & Persistence**: React Hooks + Browser `localStorage`.

---

## 🔒 Security

All LLM API calls are routed through server-side proxy routes (`/api/generate` and `/api/refine`).  
**API keys are kept strictly on the server environment and are never exposed to client browser bundles.**

---

## 🚀 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ayush-Tummalapalli/itenera_ai.git
cd itenera_ai

# 2. Install dependencies
npm install

# 3. Create .env.local with your Google Gemini API Key
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm start
```
