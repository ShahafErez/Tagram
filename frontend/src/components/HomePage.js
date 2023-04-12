import React, { useEffect } from "react";
import { SessionService } from "./SessionService";

export default function HomePage() {
  // updating the seesion service
  let sessionService = new SessionService();
  useEffect(() => {
    sessionService.updateSession();
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
