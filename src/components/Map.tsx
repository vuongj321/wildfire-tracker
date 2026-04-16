import GoogleMapReact from "google-map-react";
import { getEvents } from "../eventsAPI";
import { useEffect, useState } from "react";
import Marker from "./Marker";
import InfoBox from "./InfoBox";

type Event = {
  id: string;
  title: string;
  categories: Array<{ id: number; title: string }>;
  geometries: Array<{
    date: string;
    coordinates: [number, number];
  }>;
};

type Info = {
  id: string;
  title: string;
};

const Map = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [info, setInfo] = useState<Info | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEvents();
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setError("Could not load events data.");
        }
      } catch (err) {
        setError("Failed to fetch events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const wildfires = events
    .filter(
      (event) =>
        event.categories?.[0]?.id === 8 && event.geometries?.[0]?.coordinates,
    )
    .map((event) => {
      const [lng, lat] = event.geometries[0].coordinates;
      return (
        <Marker
          key={event.id}
          lat={lat}
          lng={lng}
          onClick={() => setInfo({ id: event.id, title: event.title })}
        />
      );
    });

  return (
    <div className="h-screen w-screen">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={{ lat: 42.3265, lng: -122.8756 }}
        defaultZoom={6}
      >
        {wildfires}
      </GoogleMapReact>
      {isLoading && (
        <div className="absolute top-2 left-2 rounded bg-white/80 px-3 py-1 text-sm">
          Loading wildfire data...
        </div>
      )}
      {error && (
        <div className="absolute top-2 left-2 rounded bg-red-600/80 px-3 py-1 text-sm text-white">
          {error}
        </div>
      )}
      {info && <InfoBox id={info.id} title={info.title} />}
    </div>
  );
};

export default Map;
