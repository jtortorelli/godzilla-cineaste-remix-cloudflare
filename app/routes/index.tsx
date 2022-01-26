import { gql, GraphQLClient } from "graphql-request";
import { useLoaderData } from "@remix-run/react";

const GetFilmsQuery = gql`
  {
    queryFilm {
      title
    }
  }
`;

export let loader = async () => {
  const graphql = new GraphQLClient(GRAPHQL_ENDPOINT, {
    fetch: fetch,
    headers: { "Dg-Auth": GRAPHQL_TOKEN },
  });
  const result = await graphql.request(GetFilmsQuery);
  console.log(result);
  const { queryFilm: films } = result;
  console.log(films);
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
        {films.map((film) => (
          <li>{film.title}</li>
        ))}
      </ul>
    </div>
  );
}
