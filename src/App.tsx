import Map from "./components/Map";

const App = () => {
  return (
    <div>
      <Map center={{ lat: 42.3265, lng: -122.8756 }} zoom={6} />
    </div>
  );
};

export default App;
