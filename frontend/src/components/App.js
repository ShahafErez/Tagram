import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";
import Routers from "./Routers";
import NavigationBar from "./NavigationBar";
import "../../static/css/styling.scss";

export default class App extends Component {
  constructor(props) {
    super(props);
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
