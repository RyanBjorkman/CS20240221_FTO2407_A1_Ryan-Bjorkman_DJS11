import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShowDetails from "./ShowDetails"; // Component for the detailed view
import Favorites from "./Favorites"; // Component for the favorites view
import "./App.css";

function App() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
 // Initialize favorites with localStorage data if available
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [currentAudio, setCurrentAudio] = useState(null); // Track the currently playing audio
  const [currentTime, setCurrentTime] = useState(0); // Track current playback time
const [duration, setDuration] = useState(0); // Track total duration of the audio
  

  // Sync favorites with localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const [selectedGenre, setSelectedGenre] = useState(""); // Track the selected genre
  const [sortCriteria, setSortCriteria] = useState("title-asc"); // Default: A-Z by title

  useEffect(() => {
    async function fetchShows() {
      setLoading(true); // Set loading state
      try {
        const response = await fetch("https://podcast-api.netlify.app/");
        const data = await response.json();

        const detailedData = await Promise.all(
          data.map(async (show) => {
            const detailResponse = await fetch(`https://podcast-api.netlify.app/id/${show.id}`);
            const detailedShow = await detailResponse.json();

            const genres = detailedShow.genres || []; // Use genres as provided by the detailed API

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
              genres, // Include genre titles
            };
          })
        );

        setShows(detailedData); // Update state with detailed data
      } catch (error) {
        console.error("Error fetching shows:", error);
      } finally {
        setLoading(false); // Ensure loading state is cleared
      }
    }
    fetchShows();
  }, []);

  // Filter and Sort Shows
  const filteredShows = selectedGenre
    ? shows.filter((show) => show.genres && show.genres.includes(selectedGenre))
    : shows;

  // Sorting logic based on sortCriteria
const sortedShows = [...filteredShows].sort((a, b) => {
  if (sortCriteria === "title-asc") {
    return a.title.localeCompare(b.title); // Ascending (A-Z)
  } else if (sortCriteria === "title-desc") {
    return b.title.localeCompare(a.title); // Descending (Z-A)
  } else if (sortCriteria === "updated-recent") {
    return new Date(b.lastUpdated) - new Date(a.lastUpdated); // Most recently updated
  } else if (sortCriteria === "updated-oldest") {
    return new Date(a.lastUpdated) - new Date(b.lastUpdated); // Oldest updated first
  }
  return 0;
});


  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/favorites">Favorites</Link>
        {/* Reset favorites button */}
        <button
          onClick={() => {
            setFavorites([]); // Clear favorites state
            localStorage.removeItem("favorites"); // Remove favorites from localStorage
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

      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Podcast Shows</h1>

              {/* Filter and Sorting Controls */}
                <div>
                  {/* Genre Filter Buttons */}
                  {[...new Set(shows.flatMap((show) => show.genres || []))]
                    .filter((genre, index, self) => genre && self.indexOf(genre) === index) // Ensure no duplicates
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


              {/* Sorting Buttons */}
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => setSortCriteria("title-asc")}>Sort A-Z</button>
                <button onClick={() => setSortCriteria("title-desc")}>Sort Z-A</button>
                <button onClick={() => setSortCriteria("updated-recent")}>Most Recently Updated</button>
                <button onClick={() => setSortCriteria("updated-oldest")}>Oldest Updated</button>
              </div>

              {/* Display Shows */}
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
        <Route path="/show/:id" element={<ShowDetails favorites={favorites} setFavorites={setFavorites} setCurrentAudio={setCurrentAudio} />} />
        <Route path="/favorites" element={<Favorites favorites={favorites} setCurrentAudio={setCurrentAudio} />} />
      </Routes>
      {/* Persist audio player */}
      {currentAudio && (
  <div className="audio-player-container">
    <h4 className="audio-player-title">Now Playing: {currentAudio.title}</h4>
    <div className="audio-controls">
      {/* Audio Element */}
      <audio
        controls
        id="audio-player"
        autoPlay
        onLoadedData={(e) => {
          setDuration(e.target.duration);
          e.target.play();
        }}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        style={{ display: "none" }} // Hide default audio controls
      >
        <source src={currentAudio.file} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Custom Progress Bar */}
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
