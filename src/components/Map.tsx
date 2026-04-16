import GoogleMapReact from "google-map-react";
import { getEvents } from "../eventsAPI";
import { useEffect, useMemo, useState } from "react";
import Marker from "./Marker";

type Event = {
  id: string;
  title: string;
  categories: Array<{ id: number; title: string }>;
  geometries: Array<{
    date: string;
    coordinates: [number, number];
  }>;
};

type MapBounds = {
  nw: { lat: number; lng: number };
  se: { lat: number; lng: number };
};

const Map = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bounds, setBounds] = useState<MapBounds | null>(null);

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

  const wildfires = useMemo(() => {
    if (!bounds) return [];

    return events
      .filter(
        (event) =>
          event.categories?.[0]?.id === 8 &&
          event.geometries?.[0]?.coordinates,
      )
      .map((event) => {
        const [lng, lat] = event.geometries[0].coordinates;
        return { event, lat, lng };
      })
      .filter(({ lat, lng }) => {
        // Only render markers that are inside the current viewport
        return (
          lat <= bounds.nw.lat &&
          lat >= bounds.se.lat &&
          lng >= bounds.nw.lng &&
          lng <= bounds.se.lng
        );
      })
      .map(({ event, lat, lng }) => {
        const isSelected = selectedId === event.id;
        return (
          <Marker
            key={event.id}
            lat={lat}
            lng={lng}
            onClick={() => setSelectedId(event.id)}
            isSelected={isSelected}
            id={event.id}
            title={event.title}
          />
        );
      });
  }, [bounds, events, selectedId]);

  return (
    <div className="h-screen w-screen">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={{ lat: 42.3265, lng: -122.8756 }}
        defaultZoom={6}
        onChange={({ bounds }) => {
          setBounds(bounds as MapBounds);
        }}
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
    </div>
  );
};

export default Map;
