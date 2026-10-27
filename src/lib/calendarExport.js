/**
 * Calendar Export Engine for Itinera AI.
 * Generates RFC 5545 compliant .ics (iCalendar) files and Google Calendar Web integration.
 */

/**
 * Parses time string like "09:00 AM - 11:30 AM" or "02:00 PM - 04:30 PM"
 * into start and end hours/minutes for a specific base date.
 */
export function parseTimeRange(timeStr, baseDate) {
  const start = new Date(baseDate);
  const end = new Date(baseDate);

  if (!timeStr || typeof timeStr !== 'string') {
    start.setHours(9, 0, 0, 0);
    end.setHours(11, 0, 0, 0);
    return { start, end };
  }

  // Regex matching "09:00 AM - 11:30 AM" or "9:00am - 12:00pm"
  const timeRegex = /(\d{1,2}):?(\d{2})?\s*(AM|PM)?\s*[-–—to]+\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i;
  const match = timeStr.match(timeRegex);

  if (match) {
    let startH = parseInt(match[1], 10);
    const startM = match[2] ? parseInt(match[2], 10) : 0;
    const startPeriod = (match[3] || match[6] || 'AM').toUpperCase();

    let endH = parseInt(match[4], 10);
    const endM = match[5] ? parseInt(match[5], 10) : 0;
    const endPeriod = match[6] ? match[6].toUpperCase() : 'PM';

    if (startPeriod === 'PM' && startH < 12) startH += 12;
    if (startPeriod === 'AM' && startH === 12) startH = 0;

    if (endPeriod === 'PM' && endH < 12) endH += 12;
    if (endPeriod === 'AM' && endH === 12) endH = 0;

    start.setHours(startH, startM, 0, 0);
    end.setHours(endH, endM, 0, 0);

    // If end is somehow earlier than start, add 2 hours to start
    if (end <= start) {
      end.setTime(start.getTime() + 2 * 60 * 60 * 1000);
    }

    return { start, end };
  }

  // Fallback heuristic based on keywords
  const lower = timeStr.toLowerCase();
  if (lower.includes('morning')) {
    start.setHours(9, 0, 0, 0);
    end.setHours(12, 0, 0, 0);
  } else if (lower.includes('afternoon') || lower.includes('lunch')) {
    start.setHours(13, 0, 0, 0);
    end.setHours(16, 0, 0, 0);
  } else if (lower.includes('evening') || lower.includes('dinner') || lower.includes('sunset')) {
    start.setHours(17, 30, 0, 0);
    end.setHours(20, 30, 0, 0);
  } else if (lower.includes('night')) {
    start.setHours(20, 0, 0, 0);
    end.setHours(23, 0, 0, 0);
  } else {
    start.setHours(10, 0, 0, 0);
    end.setHours(12, 30, 0, 0);
  }

  return { start, end };
}

/**
 * Formats a Date object into iCal format: YYYYMMDDTHHMMSS
 */
function formatICalDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}${m}${d}T${h}${min}${s}`;
}

/**
 * Clean string for iCalendar text fields (escapes semicolons, commas, backslashes)
 */
function escapeICalText(str = '') {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Generates an RFC 5545 iCalendar string from itinerary days and a given start date.
 */
export function generateItineraryICS(itinerary, startDateStr) {
  if (!itinerary || !itinerary.days) return '';

  const baseStartDate = startDateStr ? new Date(startDateStr) : new Date();
  baseStartDate.setHours(0, 0, 0, 0);

  const nowStamp = formatICalDateTime(new Date()) + 'Z';
  const cleanTitle = escapeICalText(itinerary.tripTitle || 'Trip Itinerary');

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Itinera AI//Field Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${cleanTitle}`
  ];

  itinerary.days.forEach((day, dayIndex) => {
    const currentDayDate = new Date(baseStartDate);
    currentDayDate.setDate(baseStartDate.getDate() + dayIndex);

    (day.stops || []).forEach((stop, stopIndex) => {
      const { start, end } = parseTimeRange(stop.time, currentDayDate);
      const dtStart = formatICalDateTime(start);
      const dtEnd = formatICalDateTime(end);
      const uid = `itinera-${Date.now()}-d${day.dayNumber}-s${stopIndex + 1}@itinera.ai`;

      const summary = escapeICalText(`Day ${day.dayNumber}: ${stop.title}`);
      const location = escapeICalText(stop.location ? `${stop.location}, ${itinerary.destination}` : itinerary.destination);
      
      const descriptionLines = [
        stop.description || '',
        `Category: ${stop.category || 'Sightseeing'}`,
        `Estimated Cost: ${stop.estimatedCost || 'Free'}`,
        `Scheduled: ${stop.time || 'Flexible'}`,
        'Curated via Itinera AI Field Planner'
      ].join('\\n');

      ics.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${nowStamp}`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${descriptionLines}`,
        `LOCATION:${location}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Initiates browser download of .ics file
 */
export function downloadICSFile(icsContent, fileName = 'itinera_trip.ics') {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates Google Calendar web URL for a single stop
 */
export function buildGoogleCalendarUrl(stop, dayNumber, baseDate, destination) {
  const { start, end } = parseTimeRange(stop.time, baseDate);
  const formatGCal = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const text = encodeURIComponent(`Day ${dayNumber}: ${stop.title}`);
  const details = encodeURIComponent(`${stop.description || ''}\n\nCost: ${stop.estimatedCost || 'Free'}\nCategory: ${stop.category || 'Sightseeing'}\nCurated by Itinera AI`);
  const location = encodeURIComponent(stop.location ? `${stop.location}, ${destination}` : destination);
  const dates = `${formatGCal(start)}/${formatGCal(end)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}
