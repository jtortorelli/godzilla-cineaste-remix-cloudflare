import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/films">Films</Link>
        </li>
      </ul>
    </nav>
  );
}
