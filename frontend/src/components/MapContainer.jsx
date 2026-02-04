import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };

export default function MapContainer({ location, storeName }) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location} // { lat: 28.6139, lng: 77.2090 } jaisa format
        zoom={15}
      >
        <Marker position={location} title={storeName} />
      </GoogleMap>
    </LoadScript>
  );
}