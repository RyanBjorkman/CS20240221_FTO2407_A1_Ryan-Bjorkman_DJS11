import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ShowDetails() {
  const { id } = useParams(); // Get the show ID from the URL
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(0); // Track the currently selected season

  useEffect(() => {
    async function fetchShowDetails() {
      setLoading(true);
      try {
        const response = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        const data = await response.json();
        setShow(data); // Set the show data
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchShowDetails();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!show) {
    return <h1>Show not found</h1>;
  }

  const handleSeasonChange = (event) => {
    setSelectedSeason(Number(event.target.value)); // Update the selected season index
    };

  return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>

        {/* Season Selector */}
        <label htmlFor="season-select">Select a season:</label>
        <select id="season-select" onChange={handleSeasonChange}>
            {show.seasons.map((season, index) => (
                <option key={index} value={index}>
                {season.title}
                </option>
            ))}
        </select>

        {/* Selected Season Details */}
        <div>
        <h2>{show.seasons[selectedSeason].title}</h2>
        <p>Episodes: {show.seasons[selectedSeason].episodes.length}</p>
        <img
          src={show.seasons[selectedSeason].image}
          alt={show.seasons[selectedSeason].title}
          width="200"
        />
        <ul>
          {show.seasons[selectedSeason].episodes.map((episode, index) => (
            <li key={index}>{episode.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ShowDetails;
