import { memo } from "react";

type ClusterMarkerProps = {
  count: number;
  lat: number;
  lng: number;
};

const ClusterMarker = ({ count }: ClusterMarkerProps) => {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white shadow-lg ring-2 ring-white/80">
      {count}
    </div>
  );
};

export default memo(ClusterMarker);

