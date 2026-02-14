import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

// Map ki styling (Dark Mode feeling ke liye subtle silver/retro theme)
const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: true,
  scrollwheel: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

const containerStyle = {
  width: '100%',
  height: '100%', // Parent container ki height lega
  borderRadius: '1.5rem',
};

function MapContainer({ location, storeName }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-slate-900 rounded-[2rem] flex flex-col items-center justify-center gap-4 border border-slate-800">
        <Loader2 className="text-blue-500 animate-spin" size={32} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Map Load Ho Raha Hai...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl relative group">
      {/* 🏷️ Store Label Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-red-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {storeName || "Medical Store Location"}
          </span>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* MarkerF is the newer version for React 18+ */}
        <MarkerF 
          position={location} 
          title={storeName}
          animation={window.google.maps.Animation.DROP}
        />
      </GoogleMap>
    </div>
  );
}

export default memo(MapContainer);