import { useParams } from "remix";
import Nav from "~/components/Nav";

export default function FilmRoute() {
  const params = useParams();
  return (
    <>
      <Nav />
      <h1>Film Page</h1>
      <p>This is the film page for film with slug {params.filmSlug}</p>
    </>
  );
}
