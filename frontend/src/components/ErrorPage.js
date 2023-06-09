import React from "react";

export default function ErrorPage() {
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
        Page not found, or you don't have permissions
      </h2>
      <img
        src="../../static/frontend/logo.gif"
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
