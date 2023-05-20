import React, { useEffect } from "react";
import { SessionService } from "./SessionService";

export default function HomePage() {
  // updating the seesion service
  let sessionService = new SessionService();
  useEffect(() => {
    sessionService.updateSession();
  }, []);

  return (
    <div
      class="card project-page"
      style={{
        paddingTop: "10px",
        textAlign: "center",
        width: "80%",
        margin: "auto",
        minHeight: "500px",
      }}
    >
      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Welcome to Tagram
      </h2>
      <img
        src="../../static/frontend/loading.gif"
        height="180"
        alt=""
        style={{
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />
    </div>
  );
}
