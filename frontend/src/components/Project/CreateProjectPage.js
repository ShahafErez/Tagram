import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Collapse,
} from "@material-ui/core";

// This Component will be used to both create project and edit an existing project
// export default function CreateProjectPage(props){

export default class CreateProjectPage extends Component {
  static defaultProps = {
    title: "",
    update: false,
    project_id: null,
    updateCallBack: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      successMsg: "",
      errorMsg: "",
    };

    // binding the method to the class, we we'll be able to use 'this' inside the function
    this.handleProjectTitleChange = this.handleProjectTitleChange.bind(this);
    this.handleProjectCreation = this.handleProjectCreation.bind(this);
    this.handleProjectUpdate = this.handleProjectUpdate.bind(this);
  }

  handleProjectTitleChange(e) {
    this.setState({
      title: e.target.value,
    });
  }

  // Creating a project by calling the backend (api)
  handleProjectCreation() {
    fetch("/api/project/create", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        title: this.state.title,
      }),
    })
      // redirecting to the project page after creation
      .then((response) => response.json())
      .then((data) => this.props.history.push("/project/" + data.project_id));
  }

  handleProjectUpdate() {
    this.setState({
      successMsg: "",
      errorMsg: "",
    });

    fetch("/api/project/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        title: this.state.title,
        project_id: this.props.project_id,
      }),
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        this.setState({
          successMsg: "Project updated seccesfully",
        });
      } else {
        this.setState({
          errorMsg: "Error updating project",
        });
      }
      // This function needs to be inside the 'then', so that it'll be done in order
      this.props.updateCallBack();
    });
  }

  rederCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.handleProjectCreation}
          >
            Create a project
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  rederUpdateButtons() {
    return (
      <Grid item xs={12} align="center">
        <Button
          color="primary"
          variant="contained"
          onClick={this.handleProjectUpdate}
        >
          Update Project
        </Button>
      </Grid>
    );
  }

  render() {
    const page_title = this.props.update
      ? "Update Project"
      : "Create a Project";

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <h2> {this.state.successMsg} </h2>
            ) : (
              <h2> {this.state.errorMsg} </h2>
            )}
          </Collapse>
          <Typography component="h4" varient="h4">
            {page_title}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              required={true}
              type="text"
              label="Project name"
              onChange={this.handleProjectTitleChange}
            />
          </FormControl>
        </Grid>
        {this.props.update
          ? this.rederUpdateButtons()
          : this.rederCreateButtons()}
      </Grid>
    );
  }
}
