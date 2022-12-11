import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateProjectPage from "./CreateProjectPage";

export default class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      isProjectManager: false,
      editMode: false,
    };

    this.project_id = this.props.match.params.projectID;

    // binding the functions that uses 'this'
    this.getProjectDetails = this.getProjectDetails.bind(this);
    this.updateEditMode = this.updateEditMode.bind(this);
    this.renderEditButton = this.renderEditButton.bind(this);
    this.renderEditMode = this.renderEditMode.bind(this);

    this.getProjectDetails();
  }

  // Get the project details from the backend (api)
  getProjectDetails() {
    return fetch("/api/project/get?project_id=" + this.project_id)
      .then((response) => {
        if (!response.ok) {
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          title: data.title,
          isProjectManager: data.is_project_manager,
          created_at: data.created_at,
        });
      });
  }

  updateEditMode(value) {
    this.setState({
      editMode: value,
    });
  }

  renderEditMode() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateProjectPage
            update={true}
            title={this.state.title}
            project_id={this.project_id}
            // call the function what we update the project
            updateCallBack={this.getProjectDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => this.updateEditMode(false)}
          >
            Close Edit
          </Button>
        </Grid>
      </Grid>
    );
  }

  // Function to render the edit button.
  // Could have been on the main render- seperated for readability
  renderEditButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateEditMode(true)}
        >
          Edit Project
        </Button>
      </Grid>
    );
  }

  render() {
    if (this.state.editMode) {
      return this.renderEditMode();
    }

    return (
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Project ID: {this.project_id}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Project Title: {this.state.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Created at: {this.state.created_at}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            Is project manager: {this.state.isProjectManager.toString()}
          </Typography>
        </Grid>
        {this.state.isProjectManager ? this.renderEditButton() : null}
      </Grid>
    );
  }
}
