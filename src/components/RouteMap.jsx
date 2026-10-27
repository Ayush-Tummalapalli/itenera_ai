'use client';

import { useState, useEffect, useRef } from 'react';
import { getStopCoordinates, buildGoogleMapsDirectionsUrl } from '@/lib/geoCoordinates';
import { convertCurrencyString } from '@/lib/currencyConverter';
import { MapPin, Navigation, ExternalLink, Calendar, Compass, Layers, Clock, DollarSign } from 'lucide-react';

export default function RouteMap({ itinerary, currency = 'USD' }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 0 = Day 1, or -1 for All Days
  const [selectedStopId, setSelectedStopId] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return null;
  }

  const activeDays = selectedDayIndex === -1 
    ? itinerary.days 
    : [itinerary.days[selectedDayIndex] || itinerary.days[0]];

  // Flatten active stops
  const activeStops = [];
  activeDays.forEach(day => {
    (day.stops || []).forEach((stop, idx) => {
      activeStops.push({
        ...stop,
        dayNumber: day.dayNumber,
        dayTitle: day.title,
        sequenceIndex: activeStops.length + 1,
        daySequenceIndex: idx + 1
      });
    });
  });

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initOrUpdateMap() {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = (await import('leaflet')).default;
      if (!isMounted) return;

      // Initialize map instance if not already created
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [20, 0],
          zoom: 3,
          zoomControl: false,
          scrollWheelZoom: false
        });

        // Add smooth tile layer (OpenStreetMap Humanitarian / Standard with subtle tone)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear existing markers & polylines
      markersRef.current.forEach(m => map.removeLayer(m));
      markersRef.current = [];
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }

      if (activeStops.length === 0) return;

      const latLngs = [];

      activeStops.forEach((stop, index) => {
        const coords = getStopCoordinates(stop, itinerary.destination, index, activeStops.length);
        latLngs.push(coords);

        const isHighlighted = selectedStopId === stop.id;
        const badgeNum = selectedDayIndex === -1 ? `${stop.dayNumber}.${stop.daySequenceIndex}` : `${index + 1}`;

        // Custom styled HTML DivIcon
        const iconHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: ${isHighlighted ? '#E05A3A' : '#162842'};
            color: #FAF7F0;
            font-family: ui-sans-serif, system-ui, sans-serif;
            font-size: 11px;
            font-weight: 700;
            border-radius: 9999px;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            cursor: pointer;
            transition: all 0.2s ease;
            transform: ${isHighlighted ? 'scale(1.2)' : 'scale(1)'};
          ">
            ${badgeNum}
            <div style="
              position: absolute;
              bottom: -5px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 5px solid ${isHighlighted ? '#E05A3A' : '#162842'};
            "></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker',
          iconSize: [32, 38],
          iconAnchor: [16, 36],
          popupAnchor: [0, -32]
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(map);

        // Rich Popup Window
        const formattedCost = stop.estimatedCost 
          ? convertCurrencyString(stop.estimatedCost, currency) 
          : 'Free';

        const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.title}, ${stop.location || itinerary.destination}`)}`;

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; color: #162842; min-width: 180px; max-width: 240px; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #E05A3A; letter-spacing: 0.05em;">
                Day ${stop.dayNumber} • Stop ${stop.daySequenceIndex}
              </span>
              <span style="font-size: 10px; background: #E8E1D5; color: #162842; padding: 1px 6px; border-radius: 4px; font-weight: 600;">
                ${stop.category || 'Sightseeing'}
              </span>
            </div>
            <h4 style="font-weight: 700; font-size: 13px; line-height: 1.25; margin: 0 0 4px 0; color: #162842;">
              ${stop.title}
            </h4>
            <div style="font-size: 11px; color: #526685; margin-bottom: 6px;">
              📍 ${stop.location || itinerary.destination}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; padding: 4px 0; border-top: 1px solid #E8E1D5; margin-bottom: 6px;">
              <span>🕒 ${stop.time || 'Flexible'}</span>
              <span style="font-weight: 600; color: #162842;">💰 ${formattedCost}</span>
            </div>
            <a href="${googleMapsSearchUrl}" target="_blank" rel="noopener noreferrer" style="
              display: inline-flex;
              align-items: center;
              gap: 4px;
              color: #E05A3A;
              text-decoration: none;
              font-weight: 600;
              font-size: 11px;
            ">
              View on Google Maps →
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => setSelectedStopId(stop.id));
        markersRef.current.push(marker);
      });

      // Draw connecting polyline path for day route
      if (latLngs.length > 1) {
        polylineRef.current = L.polyline(latLngs, {
          color: '#E05A3A',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      // Smoothly fit bounds
      if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    }

    initOrUpdateMap();

    return () => {
      isMounted = false;
    };
  }, [selectedDayIndex, selectedStopId, itinerary, currency]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle clicking stop in list to focus on map
  const handleSelectStop = (stop, index) => {
    setSelectedStopId(stop.id);
    if (mapInstanceRef.current && markersRef.current[index]) {
      const marker = markersRef.current[index];
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true, duration: 0.5 });
      marker.openPopup();
    }
  };

  const googleMapsRouteUrl = buildGoogleMapsDirectionsUrl(activeStops);

  return (
    <div className="rounded-lg border border-[#E8E1D5] bg-[#FDFBF7] overflow-hidden space-y-0">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E8E1D5] bg-[#F7F4EC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E05A3A]">
            <Compass className="w-4 h-4 text-[#E05A3A]" />
            <span>Interactive Geographic Route</span>
          </div>
          <h3 className="font-serif text-lg font-semibold text-[#162842] mt-0.5">
            {selectedDayIndex === -1 
              ? `Full Journey Route • ${itinerary.destination}` 
              : `Day ${itinerary.days[selectedDayIndex]?.dayNumber}: ${itinerary.days[selectedDayIndex]?.title || 'Daily Trail'}`}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Day Selector Tabs */}
          <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-md border border-[#E8E1D5]">
            <button
              onClick={() => setSelectedDayIndex(-1)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedDayIndex === -1
                  ? 'bg-[#162842] text-white'
                  : 'text-[#526685] hover:text-[#162842]'
              }`}
            >
              All Days
            </button>
            {itinerary.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setSelectedDayIndex(idx)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedDayIndex === idx
                    ? 'bg-[#162842] text-white'
                    : 'text-[#526685] hover:text-[#162842]'
                }`}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {/* Open Route in Google Maps Button */}
          <a
            href={googleMapsRouteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md bg-[#E05A3A] hover:bg-[#C94A2D] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            title="Open turn-by-turn route directions in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Google Maps Route</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>
      </div>

      {/* Grid: Map on Top/Left, Stop Sequence on Bottom/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E1D5]">
        
        {/* Leaflet Map Container */}
        <div className="lg:col-span-8 relative h-[380px] sm:h-[460px] bg-[#EAE5D9]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick Legend Overlay */}
          <div className="absolute top-3 left-3 z-[400] bg-[#FAF7F0]/90 backdrop-blur-sm border border-[#E8E1D5] rounded-md px-3 py-1.5 shadow-sm text-[11px] text-[#162842] flex items-center gap-3 pointer-events-none">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#162842]" /> Stops ({activeStops.length})
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[#E05A3A]">
              <span className="w-4 h-0.5 border-t border-dashed border-[#E05A3A]" /> Sequence Trail
            </span>
          </div>
        </div>

        {/* Stops Sequence Trail Panel */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-[#FDFBF7] max-h-[460px] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#526685]">
              Daily Stop Sequence
            </span>
            <span className="text-xs font-semibold text-[#162842]">
              {activeStops.length} Locations
            </span>
          </div>

          <div className="space-y-2">
            {activeStops.map((stop, idx) => {
              const isSelected = selectedStopId === stop.id;
              const formattedCost = stop.estimatedCost 
                ? convertCurrencyString(stop.estimatedCost, currency) 
                : 'Free';

              return (
                <button
                  key={stop.id || idx}
                  onClick={() => handleSelectStop(stop, idx)}
                  className={`w-full text-left p-3 rounded-md border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#E05A3A] bg-[#FAECE8] shadow-sm'
                      : 'border-[#E8E1D5] bg-[#FAF7F0] hover:border-[#162842]'
                  }`}
                >
                  {/* Sequence Number Badge */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isSelected
                      ? 'bg-[#E05A3A] text-white'
                      : 'bg-[#162842] text-white'
                  }`}>
                    {selectedDayIndex === -1 ? `${stop.dayNumber}.${stop.daySequenceIndex}` : `${idx + 1}`}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#162842] truncate">
                        {stop.title}
                      </h4>
                      <span className="text-[10px] uppercase font-semibold text-[#526685] shrink-0">
                        {stop.category || 'Sightseeing'}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#526685] truncate">
                      📍 {stop.location || itinerary.destination}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#526685] pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-[#E05A3A]" />
                        {stop.time || 'Flexible'}
                      </span>
                      <span className="font-semibold text-[#162842]">
                        {formattedCost}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
