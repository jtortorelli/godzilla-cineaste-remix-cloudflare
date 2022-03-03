/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/cloudflare-workers/globals" />
/// <reference types="@cloudflare/workers-types" />
export type JapaneseText = {
  original: string;
  transliteration: string;
  translation: string;
};

export type FilmAlias = {
  alias: string;
  context: string;
};

export type Studio = {
  slug: string;
  name: string;
};

export enum Format {
  novel,
  manga,
}

export type Person = {
  slug: string;
  displayName: string;
  wrote: Work;
  workedOn: Staff[];
};

export type Work = {
  format: Format;
  title: String;
  authors: Person[];
  basisFor: Film;
};

export type Staff = {
  id: string;
  role: string;
  order: number;
  member: Person;
  film: Film;
};

export type Role = {
  name: string;
  order: number;
  qualifiers: string[];
  roleGroupName: string;
  roleAvatarUrl: string;
  actor: Person;
  actorAlias: string;
  film: Film;
  character?: Character;
};

export interface Character {
  portrayedBy: Role[];
}

export type KaijuCharacter = Character & {
  slug: string;
  displayName: string;
};

export type Poster = {
  url: string;
  context: string;
  isPrimary: boolean;
};

export type Film = {
  title: string;
  slug: string;
  releaseDate: Date;
  runtime: number;
  originalTitle: JapaneseText;
  aliases: FilmAlias[];
  studios: Studio[];
  basedOn: Work;
  staff: Staff[];
  posterUrl: string;
  posters: Poster[];
  cast: Role[];
};

declare global {
  const GRAPHQL_ENDPOINT: string;
  const GRAPHQL_TOKEN: string;
}
