/**
 * Real-world geographic coordinates registry for Itinera AI destinations & landmarks.
 * Provides accurate coordinates for popular destinations and smart landmark matching,
 * with deterministic offset calculations for custom/unknown locations.
 */

export const CITY_COORDINATES = {
  tokyo: {
    center: [35.6762, 139.6503],
    zoom: 12,
    landmarks: {
      'senso-ji': [35.7148, 139.7967],
      'asakusa': [35.7126, 139.7955],
      'ichiran': [35.6595, 139.7005],
      'shibuya': [35.6580, 139.7016],
      'shibuya sky': [35.6585, 139.7022],
      'tsukiji': [35.6655, 139.7707],
      'meiji shrine': [35.6764, 139.6993],
      'yoyogi': [35.6717, 139.6949],
      'teamlab': [35.6491, 139.7898],
      'harajuku': [35.6702, 139.7027],
      'ginza': [35.6719, 139.7640],
      'shinjuku': [35.6938, 139.7034],
      'akihabara': [35.6983, 139.7731],
      'roppongi': [35.6628, 139.7314],
      'ueno': [35.7141, 139.7741]
    }
  },
  paris: {
    center: [48.8566, 2.3522],
    zoom: 12,
    landmarks: {
      'eiffel tower': [48.8584, 2.2945],
      'champ de mars': [48.8556, 2.2986],
      'louvre': [48.8606, 2.3376],
      'seine': [48.8575, 2.3450],
      'montmartre': [48.8867, 2.3431],
      'sacre-coeur': [48.8867, 2.3431],
      'le marais': [48.8575, 2.3622],
      'notre-dame': [48.8530, 2.3499],
      'arc de triomphe': [48.8738, 2.2950],
      'champs-elysees': [48.8698, 2.3075],
      'saint-germain': [48.8539, 2.3338]
    }
  },
  rome: {
    center: [41.9028, 12.4964],
    zoom: 12,
    landmarks: {
      'colosseum': [41.8902, 12.4922],
      'roman forum': [41.8925, 12.4853],
      'trevi fountain': [41.9009, 12.4833],
      'spanish steps': [41.9060, 12.4828],
      'vatican': [41.9029, 12.4534],
      'sistine chapel': [41.9029, 12.4545],
      'pantheon': [41.8986, 12.4769],
      'trastevere': [41.8890, 12.4700],
      'piazza navona': [41.8992, 12.4731],
      'giolitti': [41.9007, 12.4764]
    }
  },
  kerala: {
    center: [9.9312, 76.2673],
    zoom: 9,
    landmarks: {
      'alleppey': [9.4981, 76.3388],
      'backwaters': [9.4981, 76.3388],
      'munnar': [10.0889, 77.0595],
      'tea plantations': [10.0889, 77.0595],
      'fort kochi': [9.9658, 76.2421],
      'chinese fishing nets': [9.9678, 76.2415],
      'thekkady': [9.6031, 77.1615],
      'periyar': [9.6031, 77.1615],
      'varkala': [8.7379, 76.7163],
      'varkala cliff': [8.7379, 76.7163],
      'kochi': [9.9312, 76.2673]
    }
  },
  goa: {
    center: [15.2993, 74.1240],
    zoom: 10,
    landmarks: {
      'baga beach': [15.5553, 73.7516],
      'calangute': [15.5439, 73.7554],
      'panaji': [15.4909, 73.8278],
      'fishermans wharf': [15.4950, 73.8250],
      'fort aguada': [15.4927, 73.7736],
      'sinquerim': [15.4988, 73.7686],
      'old goa': [15.5029, 73.9118],
      'bom jesus': [15.5009, 73.9116],
      'anjuna': [15.5800, 73.7420],
      'mandovi': [15.4980, 73.8320]
    }
  },
  barcelona: {
    center: [41.3874, 2.1686],
    zoom: 12,
    landmarks: {
      'sagrada familia': [41.4036, 2.1744],
      'park guell': [41.4145, 2.1527],
      'boqueria': [41.3817, 2.1716],
      'la rambla': [41.3809, 2.1734],
      'barceloneta': [41.3809, 2.1895],
      'gothic quarter': [41.3828, 2.1772],
      'casa batllo': [41.3916, 2.1649]
    }
  },
  newyork: {
    center: [40.7128, -74.0060],
    zoom: 11,
    landmarks: {
      'statue of liberty': [40.6892, -74.0445],
      'central park': [40.7851, -73.9683],
      'times square': [40.7580, -73.9855],
      'brooklyn bridge': [40.7061, -73.9969],
      'greenwich village': [40.7336, -74.0027],
      'battery park': [40.7033, -74.0170],
      'empire state': [40.7484, -73.9857]
    }
  },
  london: {
    center: [51.5074, -0.1278],
    zoom: 12,
    landmarks: {
      'big ben': [51.5007, -0.1246],
      'london eye': [51.5033, -0.1195],
      'tower bridge': [51.5055, -0.0754],
      'buckingham palace': [51.5014, -0.1419],
      'british museum': [51.5194, -0.1270]
    }
  },
  dubai: {
    center: [25.2048, 55.2708],
    zoom: 11,
    landmarks: {
      'burj khalifa': [25.1972, 55.2744],
      'dubai mall': [25.1985, 55.2796],
      'palm jumeirah': [25.1124, 55.1390],
      'burj al arab': [25.1412, 55.1852]
    }
  }
};

/**
 * Normalizes city name string into known key
 */
export function getCityKey(destinationStr = '') {
  const lower = destinationStr.toLowerCase();
  if (lower.includes('tokyo') || lower.includes('japan')) return 'tokyo';
  if (lower.includes('paris') || lower.includes('france')) return 'paris';
  if (lower.includes('rome') || lower.includes('italy')) return 'rome';
  if (lower.includes('kerala') || lower.includes('kochi') || lower.includes('munnar')) return 'kerala';
  if (lower.includes('goa')) return 'goa';
  if (lower.includes('barcelona') || lower.includes('spain')) return 'barcelona';
  if (lower.includes('new york') || lower.includes('nyc') || lower.includes('manhattan')) return 'newyork';
  if (lower.includes('london') || lower.includes('uk') || lower.includes('england')) return 'london';
  if (lower.includes('dubai') || lower.includes('uae')) return 'dubai';
  return null;
}

/**
 * Returns lat/lng for a given stop within a destination.
 * Uses exact landmark matches where available, or generates realistic geographic distribution.
 */
export function getStopCoordinates(stop, destinationStr, stopIndex = 0, totalStops = 1) {
  const cityKey = getCityKey(destinationStr);
  const titleLower = `${stop.title || ''} ${stop.location || ''}`.toLowerCase();

  if (cityKey && CITY_COORDINATES[cityKey]) {
    const city = CITY_COORDINATES[cityKey];
    for (const [landmark, coords] of Object.entries(city.landmarks)) {
      if (titleLower.includes(landmark)) {
        return coords;
      }
    }
    // Generate realistic spread around city center
    const [baseLat, baseLng] = city.center;
    const angle = (stopIndex / Math.max(totalStops, 1)) * 2 * Math.PI + 0.3;
    const radius = 0.015 + ((stopIndex % 3) * 0.012);
    return [
      Number((baseLat + Math.sin(angle) * radius).toFixed(5)),
      Number((baseLng + Math.cos(angle) * radius * 1.2).toFixed(5))
    ];
  }

  // Generic fallback: Deterministic coordinates hash based on destination string
  let hash = 0;
  for (let i = 0; i < destinationStr.length; i++) {
    hash = (hash << 5) - hash + destinationStr.charCodeAt(i);
    hash |= 0;
  }
  const defaultLat = 20 + Math.abs(hash % 30);
  const defaultLng = 10 + Math.abs((hash * 7) % 80);
  const angle = (stopIndex / Math.max(totalStops, 1)) * 2 * Math.PI;
  const radius = 0.02 + ((stopIndex % 4) * 0.01);

  return [
    Number((defaultLat + Math.sin(angle) * radius).toFixed(5)),
    Number((defaultLng + Math.cos(angle) * radius).toFixed(5))
  ];
}

/**
 * Builds Google Maps Multi-Stop Directions URL
 */
export function buildGoogleMapsDirectionsUrl(stops = []) {
  if (!stops || stops.length === 0) return 'https://www.google.com/maps';
  
  const locations = stops.map(s => encodeURIComponent(`${s.title}, ${s.location || ''}`.trim()));
  if (locations.length === 1) {
    return `https://www.google.com/maps/search/?api=1&query=${locations[0]}`;
  }

  const origin = locations[0];
  const destination = locations[locations.length - 1];
  const waypoints = locations.slice(1, -1).join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) {
    url += `&waypoints=${waypoints}`;
  }
  url += '&travelmode=transit';
  return url;
}
