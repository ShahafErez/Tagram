import React, { Component } from "react";
import { TokenAnnotator } from "react-text-annotate";

// todo- change to be dynamic
const TEXT =
  "As a team manager I want to be able to manage players." +
  "As a team manager I want to be able to manage coaches." +
  "As a coach I want to be able to register games. ";

// todo- change to be dynamic
const TAG_COLORS = {
  Class: "#00ffa2",
  Attribute: "#84d2ff",
};

const Card = ({ children }) => (
  <div
    style={{
      boxShadow: "0 2px 4px rgba(0,0,0,.1)",
      margin: 6,
      maxWidth: 500,
      padding: 16,
    }}
  >
    {children}
  </div>
);

export default class Annotation extends Component {
  state = {
    value: [],
    // todo- need to be dynamic to the first value
    tag: "Class",
  };

  handleChange = (value) => {
    this.setState({ value });
  };

  handleTagChange = (e) => {
    this.setState({ tag: e.target.value });
  };

  render() {
    return (
      <div>
        <div>
          <Card>
            <h4>Annotate</h4>
            <select onChange={this.handleTagChange} value={this.state.tag}>
              {/* todo- change to be dyanmic */}
              <option value="Class">Class</option>
              <option value="Attribute">Attribute</option>
            </select>
            <TokenAnnotator
              style={{
                fontFamily: "IBM Plex Sans",
                maxWidth: 500,
                lineHeight: 1.5,
              }}
              tokens={TEXT.split(" ")}
              value={this.state.value}
              onChange={this.handleChange}
              getSpan={(span) => ({
                ...span,
                tag: this.state.tag,
                color: TAG_COLORS[this.state.tag],
              })}
            />
          </Card>
        </div>

        <Card>
          <h4>Output Value</h4>
          <pre>{JSON.stringify(this.state.value, null, 2)}</pre>
        </Card>
      </div>
    );
  }
}
