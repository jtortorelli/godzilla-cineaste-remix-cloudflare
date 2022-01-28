import { useParams } from "remix";

export default function FilmRoute() {
  const params = useParams();
  return (
    <>
      <h1>Film Page</h1>
      <p>This is the film page for film with slug {params.filmSlug}</p>
    </>
  );
}
