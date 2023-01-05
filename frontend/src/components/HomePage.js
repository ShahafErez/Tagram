import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";

export default function HomePage() {
  useEffect(() => {
    fetch("/api/users/getsession")
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        ReactSession.set("username", data);
      });
    // we need to put [] as the second argument, if we want to render only once
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ marginBottom: "20px" }}>Welcome to Tagram!</h2>
      <div>
        <Link to="/create">
          <button type="button" class="btn btn-primary">
            Create a new project
          </button>
        </Link>
      </div>
    </div>
  );
}
