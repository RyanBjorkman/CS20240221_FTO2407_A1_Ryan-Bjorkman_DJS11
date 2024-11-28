import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ShowDetails() {
  const { id } = useParams(); // Get the show ID from the URL
  const [show, setShow] = useState(null); // State to store the show data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [selectedSeason, setSelectedSeason] = useState(0); // State to track the selected season
  const [favorites, setFavorites] = useState([]); // State to track favorite episodes

  // Fetch the show details from the API
  useEffect(() => {
    async function fetchShowDetails() {
      setLoading(true); // Set loading to true while fetching data
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        const data = await response.json();
        setShow(data); // Update state with the fetched show data
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false); // Clear loading state after fetching
      }
    }
    fetchShowDetails();
  }, [id]);

  // Show a loading message while data is being fetched
  if (loading) {
    return <h1>Loading...</h1>;
  }

  // Show an error message if the show data is not found
  if (!show) {
    return <h1>Show not found</h1>;
  }

  // Update the selected season based on user input
  const handleSeasonChange = (event) => {
    setSelectedSeason(Number(event.target.value));
  };

  // Toggle an episode as favorite or unfavorite
  const toggleFavorite = (episode) => {
    setFavorites((prevFavorites) => {
      // Check if the episode is already in favorites
      const isFavorite = prevFavorites.some((fav) => fav.uniqueId === episode.uniqueId);

      if (isFavorite) {
        // Remove the episode from favorites if it is already favorited
        return prevFavorites.filter((fav) => fav.uniqueId !== episode.uniqueId);
      } else {
        // Add the episode to favorites if it is not already favorited
        return [...prevFavorites, episode];
      }
    });
  };

  return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>

      {/* Dropdown to select a season */}
      <label htmlFor="season-select">Select a Season:</label>
      <select id="season-select" onChange={handleSeasonChange}>
        {show.seasons.map((season, seasonIndex) => (
          <option key={seasonIndex} value={seasonIndex}>
            {season.title}
          </option>
        ))}
      </select>

      {/* Render details for the selected season */}
      <div>
        {/* Defensive check to ensure the selected season exists */}
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
              <li key={favorite.uniqueId}>{favorite.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShowDetails;
