import { memo } from "react";
import InfoBox from "./InfoBox";

type MarkerProps = {
  lat: number;
  lng: number;
  onClick?: () => void;
  isSelected?: boolean;
  id?: string;
  title?: string;
};

const Marker = ({ onClick, isSelected, id, title }: MarkerProps) => {
  return (
    <div className="relative" onClick={onClick}>
      <div className="cursor-pointer text-2xl transition-transform duration-150 hover:scale-150">
        🔥
      </div>
      {isSelected && id && title && (
        <div className="absolute left-1/2 top-0">
          <InfoBox id={id} title={title} />
        </div>
      )}
    </div>
  );
};

export default memo(Marker);
