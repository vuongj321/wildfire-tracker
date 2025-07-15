import GoogleMapReact from "google-map-react";

type MapProps = {
  eventData: {
    id: string;
    title: string;
    description?: string;
    categories: Array<{ id: number; title: string }>;
    geometry: Array<{
      date: string;
      type: string;
      coordinates: [number, number];
    }>;
  };
  center: { lat: number; lng: number };
  zoom: number;
};

const Map = ({ eventData, center, zoom }: MapProps) => {
  return (
    <div className="h-screen w-screen">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      ></GoogleMapReact>
    </div>
  );
};

export default Map;
