import { Link, useLoaderData } from "@remix-run/react";
import { formatInTimeZone } from "date-fns-tz";
import { chain, find, groupBy, partition } from "lodash";
import React from "react";
import { LoaderFunction } from "remix";
import { query } from "~/graphql.server";
import { Film, FilmAlias, Person, Staff, Studio } from "../../../remix.env";

export let loader: LoaderFunction = async ({ params }) => {
  const filmQuery = `{
  queryFilm(filter: {tenant: {eq: 1}, showcased: true, slug: {eq: "${params.filmSlug}"}}, first: 1) {
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
    staff(order: {asc: order}) {
      id
      role
      order
      member {
        slug
        displayName
      }
    }
    posters {
      url
      isPrimary
      context
    }
    entryOf {
      entryNumber
      era
      eraEntryNumber
      series {
        name
        entries {
          entryNumber
          film {
            title
            slug
          }
        }
      }
    }
    cast(order: {asc: order}) {
      name
      order
      qualifiers
      roleAvatarUrl
      roleGroupName
      actorAlias
      uncredited
      actor {
        displayName
        slug
        sortName
      }
      character {
          slug
          displayName
      }
    }
  }
  }`;
  const {
    data: { queryFilm: films },
  } = await query(filmQuery);

  if (!(films as Film[]).length) {
    throw new Response("Not Found", { status: 404 });
  }

  const [film] = films;

  const [kaiju, rest] = partition(film.cast, { roleGroupName: "Kaiju" });

  const chars = chain(rest)
    .groupBy(
      (x) => x.character?.slug ?? Math.random().toString().substring(2, 8)
    )
    .values()
    .sortBy([(x) => x[0].order, (x) => x[0].actor.sortName, (x) => x[0].name])
    .map((x) => ({
      roleName: x[0].name,
      avatarUrl: x[0].roleAvatarUrl,
      actors: x,
    }));

  const formattedKaiju = chain(kaiju)
    .groupBy(
      (x) => x.character?.slug ?? Math.random().toString().substring(2, 8)
    )
    .values()
    .sortBy((x) => x[0].order)
    .map((x) => ({
      roleName: x[0].name,
      avatarUrl: x[0].roleAvatarUrl,
      actors: x,
    }));

  return {
    ...film,
    kaiju: formattedKaiju,
    chars,
    uniqueStaffRoles: chain(film.staff).map("role").uniq().value(),
    groupedStaff: groupBy(film.staff, "role"),
    followedBy: find(film.entryOf.series.entries, [
      "entryNumber",
      film.entryOf.entryNumber + 1,
    ]),
    precededBy: find(film.entryOf.series.entries, [
      "entryNumber",
      film.entryOf.entryNumber - 1,
    ]),
    primaryPoster: find(film.posters, ["isPrimary", true]),
  };
};

export default function FilmRoute() {
  let film = useLoaderData();
  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        {/*Red Top Title*/}
        <div className="flex justify-center rounded-lg p-2">
          <div className="font-heading text-center text-2xl font-extrabold uppercase tracking-widest text-red-900">
            {film.title}
          </div>
        </div>

        {/*Film Info*/}
        <div className="flex justify-center gap-2 rounded-lg p-1">
          <div className="font-body flex items-center gap-1 text-base font-medium">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-900"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              {formatInTimeZone(
                new Date(film.releaseDate),
                "UTC",
                "d MMM yyyy"
              )}
            </div>
          </div>

          <div className="font-body flex items-center gap-1 text-base font-medium">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-900"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>{film.runtime}m</div>
          </div>
          <div className="font-body flex items-center gap-1 text-base font-medium">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-900"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              {film.studios.map((studio: Studio) => `${studio.name}`).join(",")}
            </div>
          </div>
        </div>

        {/*translation stuff*/}
        <div className="flex flex-col items-center gap-1 rounded-lg p-1">
          {/*<div className="uppercase font-heading text-sm text-red-900">*/}
          {/*  Japanese Title*/}
          {/*</div>*/}
          <div className="flex flex-row items-baseline justify-around gap-2">
            <div className="font-japanese text-base font-medium">
              {film.originalTitle.original}
            </div>
            <div className="font-body text-base font-medium text-slate-500">
              ({film.originalTitle.transliteration})
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-900"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="font-body text-base font-medium text-slate-500">
              {film.originalTitle.translation}
            </div>
          </div>
        </div>

        {/*Poster*/}
        <div className="my-1 mx-auto w-fit rounded-lg shadow-xl shadow-red-900/40">
          <img
            className="mx-auto rounded-lg object-cover"
            src={film.primaryPoster.url}
          />
        </div>

        {/*<div className="font-body text-sm tracking-wide font-medium">*/}
        {/*  Godzilla Series No. 1*/}
        {/*</div>*/}

        {/*Based on*/}
        <div className="flex flex-col items-center justify-center rounded-lg p-1">
          <div className="font-heading text-sm font-semibold uppercase text-red-900">
            Based on the {film.basedOn.format} by
          </div>
          <div className="font-heading text-base font-semibold">
            {film.basedOn.authors
              .map((author: Person) => author.displayName)
              .join(",")}
          </div>
        </div>

        {/*Aliases*/}
        <div className="flex flex-col items-center rounded-lg p-1">
          <div className="font-heading text-sm font-semibold uppercase text-red-900">
            Also known as
          </div>
          <div>
            {film.aliases.map((alias: FilmAlias) => (
              <div key={alias.alias} className="flex flex-col items-center">
                <div className="font-heading text-center text-base font-semibold">
                  {alias.alias}
                </div>
                <div className="font-body text-center text-sm font-medium text-slate-500">
                  {alias.context}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/*Series*/}
        <div className="flex flex-col items-center rounded-lg p-1">
          <div className="font-heading text-sm font-semibold uppercase text-red-900">
            {film.entryOf.series.name} Series No. {film.entryOf.entryNumber}
          </div>

          <Link to={`/films/${film.followedBy.film.slug}`}>
            <div className="flex flex-row items-center gap-1">
              <div className="font-heading text-base font-semibold">
                {film.followedBy.film.title}
              </div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-900"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Staff */}
        <div className="flex justify-center">
          <div className="grid auto-cols-auto">
            <div className="font-heading col-span-2 text-center text-sm font-semibold uppercase text-red-900">
              Staff
            </div>
            {film.uniqueStaffRoles.map((staffRole: string, index: number) => (
              <React.Fragment key={index}>
                <div className="font-body p-1 text-right text-base font-medium text-slate-500">
                  {staffRole}
                </div>
                <div className="font-heading p-1 text-base font-semibold">
                  {film.groupedStaff[staffRole].map((staff: Staff) => (
                    <div key={staff.id}>{staff.member.displayName}</div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Cast */}
        <div className="flex justify-center">
          <div className="grid grid-cols-3 items-center gap-y-2">
            <div className="font-heading col-span-3 text-center text-sm font-semibold uppercase text-red-900">
              Cast
            </div>
            {film.chars.map((role, index: number) => (
              <React.Fragment key={index}>
                <div className="items-center p-1 text-right">
                  <img
                    className="inline h-16 rounded-lg"
                    src={role.avatarUrl}
                  />
                </div>
                <div className="col-span-2 flex flex-col justify-center p-1">
                  <div className="font-body text-base text-slate-500">
                    {role.roleName}
                  </div>
                  {role.actors.map((actor, index: number) => (
                    <React.Fragment key={index}>
                      <div className="font-heading font-semibold">
                        {actor.actor.displayName}
                      </div>
                      {actor.uncredited && (
                        <div>
                          <span className="font-heading inline-flex items-center justify-center rounded bg-slate-500 px-2 py-1 text-xs font-semibold uppercase leading-none text-white">
                            Uncredited
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </React.Fragment>
            ))}
            {/* </div>
        </div> */}

            {/* Kaiju */}
            {/* <div className="flex justify-center">
          <div className="grid grid-cols-3 items-center"> */}
            <div className="font-heading col-span-3 text-center text-sm font-semibold uppercase text-red-900">
              Kaijū
            </div>
            {film.kaiju.map((role, index: number) => (
              <React.Fragment key={index}>
                <div className="items-center p-1 text-right">
                  <img
                    className="inline h-16 rounded-lg"
                    src={role.avatarUrl}
                  />
                </div>
                <div className="col-span-2 flex flex-col justify-center p-1">
                  <div className="font-body text-base text-slate-500">
                    {role.roleName}
                  </div>
                  {role.actors.map((actor, index: number) => (
                    <React.Fragment key={index}>
                      <div className="font-heading font-semibold">
                        {actor.actor.displayName}
                      </div>
                      {actor.qualifiers?.map(
                        (qualifier: string, qindex: number) => (
                          <div key={qindex}>
                            <span className="font-heading inline-flex items-center justify-center rounded bg-red-900 px-2 py-1 text-xs font-semibold uppercase leading-none text-white">
                              {qualifier}
                            </span>
                          </div>
                        )
                      )}
                      {actor.uncredited && (
                        <div>
                          <span className="font-heading inline-flex items-center justify-center rounded bg-slate-500 px-2 py-1 text-xs font-semibold uppercase leading-none text-white">
                            Uncredited
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
