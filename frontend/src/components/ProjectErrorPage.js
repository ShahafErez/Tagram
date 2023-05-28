import React from "react";

export default function ProjectErrorPage() {
  return (
    <div
      class="card project-page"
      style={{
        paddingTop: "10px",
        textAlign: "center",
        width: "80%",
        margin: "auto",
        minHeight: "500px",
        backgroundColor: "#fafafa",
      }}
    >
      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Project not found, or you don't have permissions
      </h2>
      <img src="../../static/frontend/logo.gif" height="150" alt="" />
    </div>
  );
}
