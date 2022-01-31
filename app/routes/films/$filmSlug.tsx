import { LoaderFunction } from "remix";
import Nav from "~/components/Nav";
import { query } from "~/graphql.server";
import { useLoaderData } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { FilmAlias, Person, Studio } from "../../../remix.env";

export let loader: LoaderFunction = async ({ params }) => {
  const filmQuery = `{
  getFilm(slug: "${params.filmSlug}") {
    title
    releaseDate
    runtime
    originalTitle {
      original
      transliteration
      translation
    }
    aliases {
      alias
      context
    }
    studios {
      name
    }
    basedOn {
      format
      title
      authors {
        displayName
        slug
      }
    }
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
      <h1 className="font-heading">{film.title}</h1>
      <table>
        <tbody>
          <tr>
            <td>
              <div>
                <span className="font-body">releaseDate</span>
              </div>
            </td>
            <td>
              {formatInTimeZone(
                new Date(film.releaseDate),
                "UTC",
                "d MMM yyyy"
              )}
            </td>
          </tr>
          <tr>
            <td>runtime</td>
            <td>{film.runtime}</td>
          </tr>
          <tr>
            <td>original title</td>
            <td>{film.originalTitle.original}</td>
          </tr>
          <tr>
            <td>transliteration</td>
            <td>{film.originalTitle.transliteration}</td>
          </tr>
          <tr>
            <td>translation</td>
            <td>{film.originalTitle.translation}</td>
          </tr>
          <tr>
            <td>aliases</td>
            <td>
              {film.aliases
                .map((alias: FilmAlias) => `${alias.alias} (${alias.context})`)
                .join(",")}
            </td>
          </tr>
          <tr>
            <td>studios</td>
            <td>
              {film.studios.map((studio: Studio) => `${studio.name}`).join(",")}
            </td>
          </tr>
          <tr>
            <td>based on</td>
            <td>
              the {film.basedOn.format} by{" "}
              {film.basedOn.authors
                .map((author: Person) => author.displayName)
                .join(",")}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
