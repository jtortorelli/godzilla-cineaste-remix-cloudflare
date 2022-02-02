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
      <div className="flex flex-row gap-2">
        <div className="p-4 flex flex-col bg-red-900 text-amber-50 w-fit rounded-lg shadow-md">
          <div className="font-body text-sm tracking-widest">
            Godzilla Series No. 1
          </div>
          <div className="font-heading text-xl py-2 tracking-widest">
            {film.title}
          </div>
          <div className="flex flex-row gap-2 tracking-widest">
            <div className="font-body text-sm flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Toho
            </div>
            <div className="font-body text-sm flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              3 Nov 1954
            </div>
            <div className="font-body text-sm flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              97m
            </div>
          </div>
        </div>

        <div className="p-4 w-fit rounded-lg flex-col shadow-md">
          <div className="font-body text-sm tracking-widest">
            Original Title
          </div>
          <div className="text-xl font-serif py-2 tracking-widest">
            {film.originalTitle.original}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="text-sm font-body italic">
              {film.originalTitle.transliteration}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
              />
            </svg>
            <div className="text-sm font-body italic">
              {film.originalTitle.translation}
            </div>
          </div>
        </div>
      </div>
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
