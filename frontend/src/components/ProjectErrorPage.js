import React from "react";

export default function ProjectErrorPage() {
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Project not found, or you don't have permissions
      </h2>
      <img src="../../static/frontend/loading.gif" height="150" alt="" />
    </div>
  );
}
