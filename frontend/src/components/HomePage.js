import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactSession } from "react-client-session";
// import loading from '../../static/frontend/'

export default function HomePage() {
  useEffect(() => {
    fetch("/api/users/getsession")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        ReactSession.set("username", data);
      });
    // we need to put [] as the second argument, if we want to render only once
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <img src="../../static/frontend/loading.gif" height="150" alt="" />

      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Welcome to Tagram
      </h2>
    </div>
  );
}
