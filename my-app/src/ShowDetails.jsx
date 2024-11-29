import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation

function ShowDetails({ favorites, setFavorites }) {
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

      if (isFavorite) {
        // Remove the episode from favorites
        return prevFavorites.filter((fav) => fav.uniqueId !== episode.uniqueId);
      } else {
        // Add the episode to favorites and include the show ID
        return [...prevFavorites, { ...episode, id }];
      }
    });
  };

  return (
    <div>
      {/* Show Title and Description */}
      <h1>{show.title}</h1>
      <p>{show.description}</p>

    {/* Toggle buttons for selecting a season */}
        <div>
        <h3>Select a Season:</h3>
        <div>
            {show.seasons.map((season, index) => (
            <button
                key={index}
                onClick={() => setSelectedSeason(index)} // Update the selected season index
                style={{
                margin: "5px",
                padding: "10px",
                backgroundColor: selectedSeason === index ? "#007BFF" : "#e0e0e0",
                color: selectedSeason === index ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                }}
            >
                {season.title}
            </button>
            ))}
        </div>
        </div>


      {/* Render details for the selected season */}
      <div>
        {show.seasons[selectedSeason] ? (
          <>
            <h2>{show.seasons[selectedSeason].title}</h2>
            <p>Episodes: {show.seasons[selectedSeason].episodes.length}</p>
            <img
              src={show.seasons[selectedSeason].image}
              alt={show.seasons[selectedSeason].title}
              width="200"
            />

            {/* List of episodes with favorite toggle buttons */}
            <ul>
              {show.seasons[selectedSeason].episodes.map((episode) => {
                // Generate a unique ID for each episode
                const uniqueId = `${id}-season-${selectedSeason}-episode-${episode.episode}`;

                return (
                  <li key={uniqueId}>
                    {episode.title}{" "}
                    <button onClick={() => toggleFavorite({ ...episode, uniqueId })}>
                      {favorites.some((fav) => fav.uniqueId === uniqueId)
                        ? "Unmark Favorite"
                        : "Mark as Favorite"}
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
};

export default ShowDetails;
