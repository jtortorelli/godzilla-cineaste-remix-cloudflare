import { LoaderFunction } from "remix";
import Nav from "~/components/Nav";
import { query } from "~/graphql.server";
import { useLoaderData } from "@remix-run/react";

export let loader: LoaderFunction = async ({ params }) => {
  const filmQuery = `{
  getFilm(slug: "${params.filmSlug}") {
    title
  }
  }`;
  const {
    data: { getFilm: film },
  } = await query(filmQuery);
  return film;
};

export default function FilmRoute() {
  let film = useLoaderData();
  return (
    <>
      <Nav />
      <h1>{film.title}</h1>
    </>
  );
}
