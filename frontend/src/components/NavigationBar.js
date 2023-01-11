import React from "react";
import { ReactSession } from "react-client-session";

export default function NavigationBar() {
  let username = ReactSession.get("username");

  return (
    <nav
      class="navbar navbar-expand-lg border-bottom border border-secondary"
      style={{
        backgroundColor: "white",
        padding: "0 0 0px 12px",
        marginBottom: "25px",
      }}
    >
      <a
        class="navbar-brand"
        href="/"
        style={{
          marginRight: "0px",
          paddingTop: "0px",
        }}
      >
        <img
          src="../../static/frontend/small_logo.png"
          height="22"
          alt=""
          style={{
            paddingBottom: "0px",
            marginRight: "10px",
          }}
        />
      </a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="/create">
            Create a Project
          </a>
        </li>
        {/* <li class="nav-item">
          <a class="nav-link " href="/my-projects">
            My Projects
          </a>
        </li> */}
      </ul>

      <ul class="navbar-nav" style={{ position: "absolute", right: "0px" }}>
        <li class="nav-item">
          <div class="nav-link">
            Hello <span style={{ color: "#fd8c00" }}>{username}</span>
          </div>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/logout" style={{ marginRight: "7px" }}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
