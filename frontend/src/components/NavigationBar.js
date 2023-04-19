import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";
import { SessionService } from "./SessionService";

export default function NavigationBar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [isAdmin, setIsAdmin] = useState(true);

  // updating the user information if the session service notify about change
  let sessionService;
  useEffect(() => {
    sessionService = new SessionService();
    setUsername(ReactSession.get("username"));
    sessionService.sessionSubject.subscribe({
      next: (data) => {
        setUsername(data[0]);
        setIsAdmin(data[1]);
      },
    });
  }, []);

  // emptying the session information
  function logout() {
    console.log("logout ");
    ReactSession.set("username", null);
    ReactSession.set("is_admin", null);
    setUsername(null);
    setIsAdmin(null);
    navigate("/logout");
    window.location.reload(true);
  }

  return (
    <nav
      class="navbar navbar-expand-lg border-bottom"
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
      {username != null && (
        <span>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link " href="/my-projects">
                My Projects
              </a>
            </li>
            {isAdmin && (
              <span style={{ display: "contents" }}>
                <li class="nav-item">
                  <a class="nav-link" href={`/manager/dashboard/${username}`}>
                    My Admin Projects
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="/create">
                    Create a Project
                  </a>
                </li>
              </span>
            )}
          </ul>
          <ul
            class="navbar-nav"
            style={{ position: "absolute", right: "0px", top: "0px" }}
          >
            <li class="nav-item">
              <div class="nav-link">
                Hello <span style={{ color: "#fd8c00" }}>{username}</span>
              </div>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                href="/logout"
                style={{ marginRight: "7px" }}
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </span>
      )}
      {username == null && (
        <div>
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/register">
                Register
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/login">
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
