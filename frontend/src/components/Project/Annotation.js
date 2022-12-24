import React, { Component } from "react";

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

const labels = [
  {
    id: "gryffindor",
    displayName: "Gryffindor",
    description: "Daring, strong nerve and chivalry.",
  },
  {
    id: "slytherin",
    displayName: "Slytherin",
    description: "Cunning and ambitious. Possibly dark wizard.",
  },
];

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
