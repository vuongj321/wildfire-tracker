type MarkerProps = {
  lat: number;
  lng: number;
  showInfo?: () => void;
};

const Marker = ({ lat, lng, showInfo }: MarkerProps) => {
  return <div onClick={showInfo}>🔥</div>;
};

export default Marker;
