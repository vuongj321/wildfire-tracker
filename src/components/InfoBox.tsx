type InfoBoxProps = {
  id: string;
  title: string;
};

const InfoBox = ({ id, title }: InfoBoxProps) => {
  return (
    <div className="relative -translate-x-1/2 -translate-y-full pointer-events-none">
      <div className="w-max max-w-xs rounded-lg bg-black/80 px-3 py-2 text-sm text-white shadow-lg whitespace-normal break-words">
        <div className="font-semibold leading-snug">{title}</div>
        <div className="mt-1 text-[10px] opacity-80 break-all">ID: {id}</div>
      </div>
      <div className="absolute left-1/2 top-full -translate-x-1/2">
        <div className="h-2 w-2 rotate-45 bg-black/80" />
      </div>
    </div>
  );
};

export default InfoBox;
