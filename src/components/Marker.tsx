import { memo } from "react";

type MarkerProps = {
  lat: number;
  lng: number;
  onClick?: () => void;
};

const Marker = ({ lat, lng, onClick }: MarkerProps) => {
  return <div onClick={onClick}>🔥</div>;
};

export default memo(Marker);
