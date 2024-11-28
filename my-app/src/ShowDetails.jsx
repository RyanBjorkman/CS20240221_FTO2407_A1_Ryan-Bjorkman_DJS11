import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ShowDetails() {
  const { id } = useParams(); // Get the show ID from the URL
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1>{show.title}</h1>
      <p>{show.description}</p>
      <ul>
        {show.seasons.map((season, index) => (
          <li key={index}>
            <h2>{season.title}</h2>
            <p>Episodes: {season.episodes.length}</p>
            <img src={season.image} alt={season.title} width="200" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowDetails;
