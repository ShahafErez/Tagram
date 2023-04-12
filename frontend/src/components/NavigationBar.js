import React from "react";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const navigate = useNavigate();

  let username = ReactSession.get("username");
  // let is_admin = ReactSession.get("is_admin");
  let is_admin = true; // TODO- change

  function logout() {
    ReactSession.set("username", null);
    ReactSession.set("is_admin", null);
    username = null;
    is_admin = null;
    navigate("/logout");
    window.location.reload(true);
  }

  console.log("0 ", username);
  console.log("1 ", username != null);

  return (
    <nav
      class="navbar navbar-expand-lg border-bottom border-secondary"
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
        <div>
          {is_admin && (
            <div>
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="/create">
                    Create a Project
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link " href="/my-projects">
                    My Projects
                  </a>
                </li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            class="btn btn-passive"
            style={{
              marginRight: "10px",
              backgroundColor: "#adb5bd",
              width: "80px",
            }}
            onClick={() => {
              logout();
            }}
          >
            Logout 2
          </button>

          <ul class="navbar-nav" style={{ position: "absolute", right: "0px" }}>
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
                // onClick="return logout()"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
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
