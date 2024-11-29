import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation

function ShowDetails({ favorites, setFavorites, setCurrentAudio }) {
  const { id } = useParams(); // Extract the show ID from the URL
  const [show, setShow] = useState(null); // State to store the show data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [selectedSeason, setSelectedSeason] = useState(0); // State to track the currently selected season

  // Fetch the show details when the component mounts or the `id` changes
  useEffect(() => {
    if (!id) {
      console.error("Show ID is undefined or invalid");
      return; // Exit early if `id` is invalid
    }

    async function fetchShowDetails() {
      setLoading(true); // Set loading state while fetching data
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        const data = await response.json();
        setShow(data); // Update state with the fetched show data
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false); // Clear loading state once fetching is complete
      }
    }
    fetchShowDetails();
  }, [id]);

  // Handle loading state
  if (loading) {
   // Return a loading indicator
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
      }}
    >
      <div className="spinner"></div>
      <p style={{ marginTop: "10px" }}>Loading...</p>
    </div>
  );
}

  // Handle case where the show data is not found
  if (!show) {
    return <h1>Show not found</h1>;
  }

  // Toggle an episode as favorite or unfavorite
  const toggleFavorite = (episode) => {
    setFavorites((prevFavorites) => {
        // Check if the episode is already in favorites
      const isFavorite = prevFavorites.some((fav) => fav.uniqueId === episode.uniqueId);
      const updatedFavorites = isFavorite
        ? prevFavorites.filter((fav) => fav.uniqueId !== episode.uniqueId) // Remove the episode from favorites
        : [...prevFavorites, { ...episode, id }]; // Add the episode to favorites
  
      // Save the updated favorites to localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <div>
      {/* Show Title and Description */}
      <h1>{show.title}</h1>
      <p>{show.description}</p>

    {/* Season Toggle Buttons */}
        <div style={{ marginBottom: "20px" }}>
        <h3>Choose a Season:</h3>
        <div>
            {show.seasons.map((season, index) => (
            <button
                key={index}
                onClick={() => setSelectedSeason(index)} // Update selected season
                style={{
                margin: "5px",
                padding: "10px",
                backgroundColor: selectedSeason === index ? "#007BFF" : "#f8f9fa",
                color: selectedSeason === index ? "#fff" : "#343a40",
                border: "1px solid #007BFF",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s",
                }}
            >
                {season.title}
            </button>
            ))}
        </div>
        </div>



            {/* Render Selected Season Details */}
            <div style={{ marginTop: "20px" }}>
            {show.seasons[selectedSeason] ? (
                <>
                <h2>{show.seasons[selectedSeason].title}</h2>
                <p>Episodes: {show.seasons[selectedSeason].episodes.length}</p>
                <img
                    src={show.seasons[selectedSeason].image}
                    alt={show.seasons[selectedSeason].title}
                    width="300"
                    style={{ borderRadius: "10px", marginBottom: "15px" }}
                />
                {/* Episodes List */}
                <ul>
                    {show.seasons[selectedSeason].episodes.map((episode) => {
                        const uniqueId = `${id}-season-${selectedSeason}-episode-${episode.episode}`;
                        return (
                        <li key={uniqueId} style={{ marginBottom: "20px" }}>
                            <strong>{episode.title}</strong>
                            <div style={{ margin: "10px 0" }}>
                            {/* Audio Player for the Episode */}
                            <audio controls style={{ width: "100%" }}>
                                <source src={episode.file} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            </div>
                            <button
                            onClick={() => toggleFavorite({ ...episode, uniqueId })}
                            style={{
                                marginTop: "5px",
                                padding: "5px 10px",
                                backgroundColor: favorites.some((fav) => fav.uniqueId === uniqueId)
                                ? "#dc3545"
                                : "#007BFF",
                                color: "#fff",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                            }}
                            >
                            {favorites.some((fav) => fav.uniqueId === uniqueId)
                                ? "Unmark Favorite"
                                : "Mark as Favorite"}
                            </button>
                            <button
                                onClick={() => setCurrentAudio({ ...episode, title: `${show.title} - ${episode.title}` })}
                                style={{
                                    marginTop: "5px",
                                    padding: "5px 10px",
                                    backgroundColor: "#007BFF",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "3px",
                                    cursor: "pointer",
                                }}
                                >
                                Play Episode
                            </button>
                        </li>
                        );
                    })}
                </ul>

                </>
            ) : (
                <p>No episodes available for this season.</p>
            )}
            </div>


      {/* List of favorited episodes */}
      {favorites.length > 0 && (
        <div>
          <h3>Favorite Episodes:</h3>
          <ul>
            {favorites.map((favorite) => (
              <li key={favorite.uniqueId}>
                <h2>{favorite.title}</h2>
                <p>{favorite.description}</p>
                <audio controls>
                  <source src={favorite.file} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// PropTypes validation for ShowDetails component
ShowDetails.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      uniqueId: PropTypes.string.isRequired, // Unique ID for the episode
      title: PropTypes.string.isRequired,   // Title of the episode
      description: PropTypes.string,        // Description of the episode
      file: PropTypes.string,               // Audio file URL
      id: PropTypes.string.isRequired,      // Show ID for navigation
    })
  ).isRequired,
  setFavorites: PropTypes.func.isRequired, // Function to update favorites
  setCurrentAudio: PropTypes.func.isRequired, // Function to set current audio
};

export default ShowDetails;
