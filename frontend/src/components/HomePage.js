import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>Welcome to Tagram!</h2>
      <div>
        <Link to="/create">
          <button type="button" class="btn btn-warning">
            Create a new project
          </button>
        </Link>
      </div>
    </div>
  );
}
