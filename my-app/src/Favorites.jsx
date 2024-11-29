import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes for validation

function Favorites({ favorites, setCurrentAudio }) {
  // Render a message if there are no favorites
  if (favorites.length === 0) {
    return <h1>No favorites yet!</h1>;
  }

  return (
    <div>
      <h1>Your Favorite Episodes</h1>
      <ul>
        {/* Iterate through the favorites array and render each episode */}
        {favorites.map((favorite) => (
          <li key={favorite.uniqueId}>
            {/* Episode Title */}
            <h2>{favorite.title}</h2>

            {/* Episode Description */}
            <p>{favorite.description}</p>

            {/* Play Episode Button */}
            <button
              onClick={() => {
                setCurrentAudio(favorite); // Update the currently playing episode

                // Trigger playback once the audio player updates
                const audioElement = document.getElementById("audio-player"); // Select the audio player by its ID
                if (audioElement) {
                  audioElement.load(); // Reload the updated audio source
                  audioElement.play(); // Start playback
                }
              }}
            >
              Play Episode
            </button>


            {/* Link back to the details page of the episode's show */}
            <p>
              <Link to={`/show/${favorite.id}`}>Go to Show</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// PropTypes validation for Favorites component
Favorites.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      uniqueId: PropTypes.string.isRequired, // Unique ID for the episode
      title: PropTypes.string.isRequired,   // Title of the episode
      description: PropTypes.string,        // Description of the episode
      file: PropTypes.string,               // Audio file URL
      id: PropTypes.string.isRequired,      // Show ID for navigation
    })
  ).isRequired,
  setCurrentAudio: PropTypes.func.isRequired, // setCurrentAudio prop validation
};

export default Favorites;
