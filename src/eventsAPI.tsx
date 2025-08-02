export const getEvents = async () => {
  const URL = "https://eonet.gsfc.nasa.gov/api/v2.1/events";

  try {
    const res = await fetch(URL);
    const data = await res.json();

    return data.events;
  } catch (err) {
    console.log(err);
  }
};
