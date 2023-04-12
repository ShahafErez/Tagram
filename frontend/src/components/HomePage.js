import React, { useEffect } from "react";
import { ReactSession } from "react-client-session";
// import loading from '../../static/frontend/'

export default function HomePage() {
  useEffect(() => {
    fetch("/api/users/getsession")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        ReactSession.set("username", data[0]);
        ReactSession.set("is_admin", data[1]);
        console.log(data);
        fetch("/api/users/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({
            username: data[0],
            is_admin: data[1],
          }),
        });
      })
      .catch((error) => {
        console.log("Error:", error);
      });
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
