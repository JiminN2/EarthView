import { useEffect, useState } from "react";

const API_KEY = "O53RI8cSI6O7B1gmUT30ZZdh1liaVqd2BFHpta7a";
const URL = `https://api.nasa.gov/planetary/apod`;

interface NasaData {
  title: string;
  explanation: string;
  media_type: string;
  url: string;
}

export default function NasaImage() {
  const [data, setData] = useState<NasaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${URL}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Failed to load data.</p>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.explanation}</p>
      {data.media_type === "image" ? (
        <img src={data.url} alt={data.title} style={{ maxWidth: "100%" }} />
      ) : (
        <iframe
          width="560"
          height="315"
          src={data.url}
          title={data.title}
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
}
