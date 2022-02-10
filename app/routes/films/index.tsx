import { Link, useLoaderData } from "@remix-run/react";
import { query } from "~/graphql.server";
import { Film } from "../../../remix.env";

export let loader = async () => {
  const allFilmsQuery = `{
  queryFilm(order: {asc: title, then: {asc: releaseDate}}) {
    title
    releaseDate
    slug
  }
}
`;
  const {
    data: { queryFilm: films },
  } = await query(allFilmsQuery);
  return films;
};

export default function FilmsIndexRoute() {
  let films = useLoaderData();
  return (
    <>
      <h1>Films Index</h1>
      <ul>
        {films.map((film: Film) => (
          <li key={film.slug}>
            <Link to={`/films/${film.slug}`}>
              {film.title} ({new Date(film.releaseDate).getFullYear()})
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
