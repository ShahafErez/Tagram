import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to Tagram!</h2>
      <div>
        <Link to="/create">Create a new project</Link>
      </div>
      <div>
        <Link to="/annotate">Annotate a project</Link>
      </div>
    </div>
  );
}
