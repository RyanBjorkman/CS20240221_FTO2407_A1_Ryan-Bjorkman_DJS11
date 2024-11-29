import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShowDetails from "./ShowDetails"; // Component for the detailed view
import Favorites from "./Favorites"; // Component for the favorites view
import "./App.css";

function App() {
  // State to store the list of shows fetched from the API
  const [shows, setShows] = useState([]);
  // State to manage loading status while fetching data
  const [loading, setLoading] = useState(true);
  // State to track errors during data fetching
  const [error, setError] = useState(null);
  // State to store user's favorite episodes, initialized from localStorage
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  // State to track the currently playing audio
  const [currentAudio, setCurrentAudio] = useState(null);
  // State to track the current playback time
  const [currentTime, setCurrentTime] = useState(0);
  // State to track the total duration of the audio
  const [duration, setDuration] = useState(0);
  // State to track the selected genre for filtering
  const [selectedGenre, setSelectedGenre] = useState("");
  // State to track the sorting criteria for shows
  const [sortCriteria, setSortCriteria] = useState("title-asc");

  // Effect to sync the favorites state with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Effect to fetch podcast shows from the API on component mount
  useEffect(() => {
    async function fetchShows() {
      setLoading(true); // Set loading state while fetching data
      try {
        const response = await fetch("https://podcast-api.netlify.app/");
        if (!response.ok) {
          trow new Error('HTTP Error: ${response.status}'); // Handle HTTP errors
        }
        const data = await response.json();

        // Fetch additional details for each show
        const detailedData = await Promise.all(
          data.map(async (show) => {
            const detailResponse = await fetch(`https://podcast-api.netlify.app/id/${show.id}`);
            const detailedShow = await detailResponse.json();

            // Extract genres and format last updated date
            const genres = detailedShow.genres || [];
            const lastUpdated = detailedShow.updated
              ? new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(detailedShow.updated))
              : "Unknown";

            return {
              ...show,
              seasons: detailedShow.seasons || [],
              lastUpdated,
              genres,
            };
          })
        );

        setShows(detailedData); // Update state with detailed data
      } catch (err) {
        console.error("Error fetching shows:", err);
        setError(err); // Set error state if an error occurs
      } finally {
        setLoading(false); // Clear loading state
      }
    }

    fetchShows();
  }, []);

  // Filter the shows based on the selected genre
  const filteredShows = selectedGenre
    ? shows.filter((show) => show.genres && show.genres.includes(selectedGenre))
    : shows;

  // Sort the shows based on the selected sorting criteria
  const sortedShows = [...filteredShows].sort((a, b) => {
    if (sortCriteria === "title-asc") {
      return a.title.localeCompare(b.title); // Ascending by title
    } else if (sortCriteria === "title-desc") {
      return b.title.localeCompare(a.title); // Descending by title
    } else if (sortCriteria === "updated-recent") {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated); // Most recently updated first
    } else if (sortCriteria === "updated-oldest") {
      return new Date(a.lastUpdated) - new Date(b.lastUpdated); // Oldest updated first
    }
    return 0;
  });

  // Display a loading message while data is being fetched
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {/* Navigation links */}
      <nav>
        <Link to="/">Home</Link> | <Link to="/favorites">Favorites</Link>
        {/* Button to reset favorites */}
        <button
          onClick={() => {
            setFavorites([]);
            localStorage.removeItem("favorites");
          }}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Reset Favorites
        </button>
      </nav>

      {/* Define application routes */}
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <div>
              <h1>Podcast Shows</h1>

              {/* Genre filter buttons */}
              <div>
                {[...new Set(shows.flatMap((show) => show.genres || []))]
                  .filter((genre, index, self) => genre && self.indexOf(genre) === index)
                  .map((genre) => (
                    <button
                      key={genre}
                      onClick={() => setSelectedGenre(genre)}
                      style={{
                        fontWeight: selectedGenre === genre ? "bold" : "normal",
                      }}
                    >
                      {genre}
                    </button>
                  ))}
              </div>

              {/* Sorting buttons */}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => setSortCriteria("title-asc")}>Sort A-Z</button>
                <button onClick={() => setSortCriteria("title-desc")}>Sort Z-A</button>
                <button onClick={() => setSortCriteria("updated-recent")}>
                  Most Recently Updated
                </button>
                <button onClick={() => setSortCriteria("updated-oldest")}>
                  Oldest Updated
                </button>
              </div>

              {/* List of shows */}
              <ul>
                {sortedShows.map((show) => (
                  <li key={show.id}>
                    <Link to={`/show/${show.id}`}>
                      <h2>{show.title}</h2>
                      <p>{show.description}</p>
                      <p>Genres: {show.genres.join(", ")}</p>
                      <p>Seasons: {show.seasons.length}</p>
                      <p>Last Updated: {show.lastUpdated}</p>
                      <img src={show.image} alt={show.title} width="200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        {/* Route for show details */}
        <Route
          path="/show/:id"
          element={
            <ShowDetails
              favorites={favorites}
              setFavorites={setFavorites}
              setCurrentAudio={setCurrentAudio}
            />
          }
        />
        {/* Route for favorites */}
        <Route
          path="/favorites"
          element={
            <Favorites
              favorites={favorites}
              setCurrentAudio={setCurrentAudio}
            />
          }
        />
      </Routes>

      {/* Persistent audio player */}
      {currentAudio && (
        <div className="audio-player-container">
          <h4 className="audio-player-title">
            Now Playing: {currentAudio.title || "Unknown Title"}
          </h4>
          <audio
            controls
            id="audio-player"
            autoPlay
            onLoadedData={(e) => {
              setDuration(e.target.duration);
              e.target.play();
            }}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            style={{ display: "none" }}
          >
            <source src={currentAudio.file} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          {/* Custom media player controls */}
          <div className="audio-controls">
            <button
              onClick={() => {
                const audioElement = document.getElementById("audio-player");
                if (audioElement) audioElement.currentTime -= 10; // Rewind 10 seconds
              }}
            >
              ⏪ 10s
            </button>
            <button
              onClick={() => {
                const audioElement = document.getElementById("audio-player");
                if (audioElement.paused) audioElement.play();
                else audioElement.pause();
              }}
            >
              ⏯
            </button>
            <button
              onClick={() => {
                const audioElement = document.getElementById("audio-player");
                if (audioElement) audioElement.currentTime += 10; // Forward 10 seconds
              }}
            >
              10s ⏩
            </button>
            <input
              type="range"
              className="audio-progress-bar"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const audioElement = document.getElementById("audio-player");
                if (audioElement) {
                  audioElement.currentTime = e.target.value;
                  setCurrentTime(e.target.value);
                }
              }}
            />
            <p className="audio-timing">
              {new Date(currentTime * 1000).toISOString().substr(11, 8)} /{" "}
              {new Date(duration * 1000).toISOString().substr(11, 8)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
