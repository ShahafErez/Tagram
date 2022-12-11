import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { render } from "react-dom";
import Routers from "./Routers";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Routers />
        </BrowserRouter>
      </div>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
