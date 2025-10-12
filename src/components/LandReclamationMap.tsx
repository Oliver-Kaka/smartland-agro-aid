import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Site {
  id: number;
  name: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  suitability: number;
  area: string;
  description: string;
}

interface LandReclamationMapProps {
  sites: Site[];
}

const LandReclamationMap = ({ sites }: LandReclamationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || sites.length === 0) return;

    // Clear existing map if it exists
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Calculate center from sites
    const avgLat = sites.reduce((sum, site) => sum + site.coordinates.lat, 0) / sites.length;
    const avgLng = sites.reduce((sum, site) => sum + site.coordinates.lng, 0) / sites.length;

    // Initialize map
    const map = L.map(mapContainer.current).setView([avgLat, avgLng], 6);
    mapInstance.current = map;

    // Add OpenStreetMap base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add topographical overlay
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenTopoMap contributors',
      maxZoom: 17,
      opacity: 0.5,
    }).addTo(map);

    // Add markers for each site
    sites.forEach((site) => {
      const marker = L.marker([site.coordinates.lat, site.coordinates.lng]).addTo(map);
      
      // Create custom popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #059669;">${site.name}</h3>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Type:</strong> ${site.type}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Area:</strong> ${site.area}</p>
          <p style="margin: 4px 0; font-size: 12px;"><strong>Suitability:</strong> ${site.suitability}%</p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">${site.description}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    // Fit bounds to show all markers
    if (sites.length > 1) {
      const bounds = L.latLngBounds(sites.map(site => [site.coordinates.lat, site.coordinates.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [sites]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-lg shadow-lg border border-border"
    />
  );
};

export default LandReclamationMap;
