import GoogleMapReact from "google-map-react";
import Supercluster from "supercluster";
import type { ClusterFeature, PointFeature } from "supercluster";
import { getEvents } from "../eventsAPI";
import { useEffect, useMemo, useState } from "react";
import ClusterMarker from "./ClusterMarker";
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
  const [zoom, setZoom] = useState<number>(6);

  type WildfireProperties = {
    cluster: boolean;
    eventId: string;
    title: string;
    point_count?: number;
  };

  const clusterIndex = useMemo(() => {
    const wildfireEvents = events.filter(
      (event) =>
        event.categories?.[0]?.id === 8 && event.geometries?.[0]?.coordinates,
    );

    const points: PointFeature<WildfireProperties>[] = wildfireEvents.map(
      (event) => {
        const [lng, lat] = event.geometries[0].coordinates;

        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          properties: {
            cluster: false,
            eventId: event.id,
            title: event.title,
          },
        };
      },
    );

    return new Supercluster<WildfireProperties>({
      radius: 60,
      maxZoom: 16,
    }).load(points);
  }, [events]);

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

  const markers = useMemo(() => {
    if (!bounds) return [];

    const bbox: [number, number, number, number] = [
      bounds.nw.lng,
      bounds.se.lat,
      bounds.se.lng,
      bounds.nw.lat,
    ];

    const clusters = clusterIndex.getClusters(bbox, Math.round(zoom)) as
      | ClusterFeature<WildfireProperties>[]
      | PointFeature<WildfireProperties>[];

    return clusters.map((clusterItem) => {
      const [lng, lat] = clusterItem.geometry.coordinates;
      const {
        cluster: isCluster,
        point_count: pointCount,
        eventId,
        title,
      } = clusterItem.properties as WildfireProperties;

      if (isCluster) {
        return (
          <ClusterMarker
            key={`cluster-${(clusterItem.id as number) ?? `${lng}-${lat}`}`}
            lat={lat}
            lng={lng}
            count={pointCount ?? 0}
          />
        );
      }

      const isSelected = selectedId === eventId;

      return (
        <Marker
          key={eventId}
          lat={lat}
          lng={lng}
          onClick={() => setSelectedId(eventId)}
          isSelected={isSelected}
          id={eventId}
          title={title}
        />
      );
    });
  }, [bounds, clusterIndex, selectedId, zoom]);

  return (
    <div className="h-screen w-screen">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={{ lat: 42.3265, lng: -122.8756 }}
        defaultZoom={6}
        onChange={({ bounds, zoom }) => {
          setBounds(bounds as MapBounds);
          setZoom(zoom);
        }}
      >
        {markers}
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
