import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";
import { ReactSession } from "react-client-session";
import Routers from "./Routers";
import NavigationBar from "./NavigationBar";
import "../../static/css/styling.scss";
import "bootstrap-icons/font/bootstrap-icons.css";

export default class App extends Component {
  constructor(props) {
    super(props);
    ReactSession.setStoreType("localStorage");
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <NavigationBar />
          <div class="content">
            <Routers />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
