import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  // State for storing fetched podcast shows and loading status
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from the API when the component loads
  useEffect(() => {
    async function fetchShows() {
      setLoading(true);
      try {
        const response = await fetch("https://podcast-api.netlify.app/");
        const data = await response.json();
        setShows(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false); // Ensure loading state is cleared
      }
    }
    fetchShows();
  }, []);

  // Display a loading message while data is being fetched
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // Render the list of podcast shows once the data is fetched
  return (
    <div>
      <h1>Podcast Shows</h1>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            <h2>{show.title}</h2>
            <p>{show.description}</p>
            <img src={show.image} alt={show.title} width="200" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
