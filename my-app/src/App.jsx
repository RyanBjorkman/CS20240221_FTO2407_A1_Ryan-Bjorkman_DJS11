import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShowDetails from "./ShowDetails"; // Component for the detailed view
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

        // Sort shows alphabetically by title
        const sortedData = data.sort((a, b) => a.title.localeCompare(b.title));

        setShows(sortedData); // Update state with the fetched data
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
    <Routes>
      {/* Home Route */}
      <Route
        path="/"
        element={
          <div>
            <h1>Podcast Shows</h1>
            <ul>
              {shows.map((show) => (
                <li key={show.id}>
                  <Link to={`/show/${show.id}`}>
                    <h2>{show.title}</h2>
                    <p>{show.description}</p>
                    <img src={show.image} alt={show.title} width="200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        }
      />
      {/* Show Details Route */}
      <Route path="/show/:id" element={<ShowDetails />} />
    </Routes>
  );
}

export default App;
