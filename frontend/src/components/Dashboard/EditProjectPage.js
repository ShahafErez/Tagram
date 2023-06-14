import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProjectPage() {
  const navigate = useNavigate();
  let { projectId } = useParams();
  let username = ReactSession.get("username");

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [unselectedAnnotators, setUnselectedAnnotators] = useState([]);

  // getting all users for selecting users to project
  const [users, setUsers] = useState([]);
  const [projectDetails, setProjectDetails] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetch("/api/project/get?project_id=" + projectId)
      .then((response) => response.json())
      .then((data) => {
        setProjectDetails(data);
      });
  }, []);

  useEffect(() => {
    fetch("/api/users/get-all")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        getUsersByProject(data);
      });
  }, []);

  /** Saving the project deatil
   * Sends details to the backend
   */
  const handleSubmit = (e) => {
    // prevent the page from re-loading after submit
    e.preventDefault();
    let titleBody = title;
    let descriptionBody = description;
    if (title == "") {
      titleBody = projectDetails.title;
    }
    if (description == "") {
      descriptionBody = projectDetails.description;
    }
    fetch("/api/project/edit?project_id=" + projectId, {
      method: "PUT",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        title: titleBody,
        description: descriptionBody,
      }),
    })
      .then(() => {
        fetch("/api/users/create-user-project-mapping", {
          method: "POST",
          headers: { "Content-Type": "application/json ; charset=utf-8" },
          body: JSON.stringify({
            project: projectId,
            user: selectedUsers,
          }),
        });
      })
      .then(() => {
        navigate(`/manager/dashboard/${username}`);
      });
  };

  /* General */
  function getUsersByProject(allUsers) {
    // get all annotators in project
    fetch("/api/users/users-by-project/?project=" + projectId)
      .then((response) => response.json())
      .then((data) => {
        // get users annotation
        let selectedUsers = data.map((obj) => obj.username);
        let unselectedUsers = [];
        allUsers.forEach((user) => {
          if (!selectedUsers.includes(user.username)) {
            unselectedUsers.push(user);
          }
        });
        setUnselectedAnnotators(unselectedUsers);
      });
  }

  function SelectUser(username) {
    let temp_users = JSON.parse(JSON.stringify(selectedUsers));
    // add/remove
    if (temp_users.includes(username)) {
      temp_users.splice(temp_users.indexOf(username), 1);
      let temp_annotators = JSON.parse(JSON.stringify(unselectedAnnotators));
      if (temp_annotators.includes(username)) {
        temp_annotators.splice(temp_annotators.indexOf(username), 1);
        if (temp_annotators.length == 0) {
          temp_annotators.push("fakeUserOnlyForRemainLengthBiggerThanOne");
        }
        setUnselectedAnnotators(temp_annotators);
      }
    } else {
      temp_users.push(username);
    }
    setSelectedUsers(temp_users);
  }

  return (
    <div
      class="card"
      style={{ maxWidth: "75%", margin: "auto", padding: "20px" }}
    >
      {/* If we're in: create meta-tagging, browse meta-tagging or check correctness -> 
        we set the className to be 'hide', and we hide the content in style.css
      */}
      <div>
        {/* Create a new project form */}
        <h2>Edit project details</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: "15px" }}>
            {projectDetails != null && (
              <div>
                <label>Project Title</label>
                <input
                  class="form-control"
                  id="exampleFormControlTextarea2"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={projectDetails.title}
                />

                <div style={{ marginTop: "15px" }}>
                  {" "}
                  <label>Project Description</label>
                  <textarea
                    isEditable="true"
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    defaultValue={projectDetails.description}
                    placeholder="Your project description"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Displaying a list of all users */}
          <div
            class="accordion"
            id="accordionExample"
            style={{ marginTop: "15px" }}
          >
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Add taggers to your project
                  <i
                    class="bi bi-person-add fa-6x"
                    style={{ fontSize: "25px", marginLeft: "8px" }}
                  ></i>
                </button>
              </h2>
              <div
                id="collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">
                  {users.length > 0 &&
                    unselectedAnnotators.length > 0 &&
                    unselectedAnnotators.map((user, index) => {
                      const checkboxId = `flexCheckDefault_${index}`; // Unique id for each checkbox
                      return (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            onClick={() => {
                              SelectUser(user.username);
                            }}
                          />
                          <label
                            class="form-check-label"
                            for="flexCheckDefault"
                          >
                            {user.username}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Saving is only enabled if all required fields are inserted */}
          {selectedUsers.length > 0 ? (
            <button
              type="submit"
              class="btn btn-primary"
              style={{ marginTop: "15px" }}
            >
              Save
            </button>
          ) : (
            <button
              type="submit"
              class="btn btn-primary disabled"
              style={{ marginTop: "15px" }}
            >
              Save
            </button>
          )}
        </form>
      </div>

      {/* Calling the component the user has clicked on */}
    </div>
  );
}
