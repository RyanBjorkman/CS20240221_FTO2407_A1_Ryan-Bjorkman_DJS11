import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes for validation

function Favorites({ favorites }) {
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
            
            {/* Audio Player for the Episode */}
            <audio controls>
              <source src={favorite.file} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
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
  };

export default Favorites;
