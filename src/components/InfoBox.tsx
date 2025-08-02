const InfoBox = ({ id, title }) => {
  return (
    <div className="absolute top-0 left 0 w-1/3 bg-black/40 not-only:rounded-br-lg">
      <div className="text-white p-1">
        <h1>{id}</h1>
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default InfoBox;
