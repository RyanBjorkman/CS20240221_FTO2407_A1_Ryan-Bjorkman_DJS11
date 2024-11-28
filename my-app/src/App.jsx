import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShowDetails from "./ShowDetails"; // Component for the detailed view
import Favorites from "./Favorites"; // Component for the favorites view
import "./App.css";

function App() {
  // State for storing fetched podcast shows and loading status
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); // Shared state for managing favorites

  // Fetch data from the API when the component loads
  useEffect(() => {
    async function fetchShows() {
      setLoading(true); // Set loading state
      try {
        const response = await fetch("https://podcast-api.netlify.app/");
        const data = await response.json();
  
        // Fetch detailed data for each show
        const detailedData = await Promise.all(
          data.map(async (show) => {
            const detailResponse = await fetch(`https://podcast-api.netlify.app/id/${show.id}`);
            const detailedShow = await detailResponse.json();
            return { ...show, seasons: detailedShow.seasons || [] }; // Add seasons data
          })
        );
  
        // Sort shows alphabetically by title
        const sortedData = detailedData.sort((a, b) => a.title.localeCompare(b.title));
  
        setShows(sortedData); // Update state with detailed data
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

  return (
    <div>
      {/* Navigation Bar */}
      <nav>
        <Link to="/">Home</Link> | <Link to="/favorites">Favorites</Link>
      </nav>

      {/* Routes for different pages */}
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div>
              <h1>Podcast Shows</h1>
              <ul>
                {shows.map((show) => (
                  <li key={show.id}>
                    <Link to={`/show/${show.id}`}>
                    {/* Display the show title */}
                      <h2>{show.title}</h2>

                      {/* Display the show description */}
                      <p>{show.description}</p>

                      {/* Display the number of seasons */}
                      <p>Seasons: {show.seasons.length}</p>

                      {/* Display the show preview image */}
                      <img src={show.image} alt={show.title} width="200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        {/* Show Details Page */}
        <Route
          path="/show/:id"
          element={<ShowDetails favorites={favorites} setFavorites={setFavorites} />}
        />
        {/* Favorites Page */}
        <Route path="/favorites" element={<Favorites favorites={favorites} />} />
      </Routes>
    </div>
  );
}

export default App;
