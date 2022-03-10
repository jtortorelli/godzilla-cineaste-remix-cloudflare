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
                className="h-4 w-4 text-red-900"
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
                className="h-4 w-4 text-red-900"
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
            </div>
            <div>{film.runtime}m</div>
          </div>
          <div className="font-body flex items-center gap-1 text-base font-medium">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-900"
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
                className="h-4 w-4 text-red-900"
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
                  className="h-4 w-4 text-red-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
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
