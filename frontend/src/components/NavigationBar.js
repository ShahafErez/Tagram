import React from "react";


export default function NavigationBar() {
    return (
    <nav
      class="navbar border-bottom border border-secondary"
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
      <a
        class="nav-link me-auto"
        href="/create"
        style={{ color: "black", fontSize: "17px" }}
      >
        Create a Project
      </a>
      <span><a href="/logout" style={{ fontSize: "17px", margin: "20px" }}>Logout</a></span>
    </nav>
  );
}
