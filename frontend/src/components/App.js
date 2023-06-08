import "bootstrap-icons/font/bootstrap-icons.css";
import React, { Component } from "react";
import { ReactSession } from "react-client-session";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "../../static/css/styling.scss";
import NavigationBar from "./NavigationBar";
import Routers from "./Routers";

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
