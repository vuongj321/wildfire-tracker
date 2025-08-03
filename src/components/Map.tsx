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
  const [info, setInfo] = useState<Info | null>();

  useEffect(() => {
    getEvents().then((data) => setEvents(data));
  });

  const wildfires = events
    .filter((event) => event.categories[0].id === 8)
    .map((event, index) => (
      <Marker
        key={index}
        lat={event.geometries[0].coordinates[1]}
        lng={event.geometries[0].coordinates[0]}
        onClick={() => setInfo({ id: event.id, title: event.title })}
      />
    ));

  return (
    <div className="h-screen w-screen">
      <GoogleMapReact
        bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLE_API_KEY }}
        defaultCenter={{ lat: 42.3265, lng: -122.8756 }}
        defaultZoom={6}
      >
        {wildfires}
      </GoogleMapReact>
      {info && <InfoBox id={info.id} title={info.title} />}
    </div>
  );
};

export default Map;
