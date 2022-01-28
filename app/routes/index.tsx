import { useLoaderData } from "@remix-run/react";
import { Film } from "../../remix.env";

export let loader = async () => {
  const result = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Dg-Auth": GRAPHQL_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
    query MyQuery {
    queryFilm {
      title
    }
  }
  `,
    }),
  });
  const json = await result.json();
  const { queryFilm: films } = json.data;
  return films;
};

export default function Index() {
  let films = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
        <li>this is a shameless plug for my other site!</li>
        {films.map((film: Film) => (
          <li key={film.title}>{film.title}</li>
        ))}
      </ul>
    </div>
  );
}
