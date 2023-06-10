import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProjectPage(props) {
  const navigate = useNavigate();
  let { projectId } = useParams();
  let username = ReactSession.get("username");

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [annotators, setAnnotators] = useState([]);

  // getting all users for selecting users to project
  const [users, setUsers] = useState([]);
  const [projectDetailsTitle, setProjectDetails] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* useEffects */
  useEffect(() => {
    // set project's annotators array
    getUsersByProject();
  }, []);

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
    console.log(projectDetailsTitle.title);
    if (title == "") {
      titleBody = projectDetailsTitle.title;
    }
    if (description == "") {
      descriptionBody = projectDetailsTitle.description;
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
        fetch(
          "/api/project/delete-users-from-project?project_id=" + projectId,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json ; charset=utf-8" },
          }
        );
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
  function getUsersByProject() {
    // get all annotators in project
    fetch("/api/users/users-by-project/?project=" + projectId)
      .then((response) => response.json())
      .then((data) => {
        // get users annotation
        setAnnotators(data.map((obj) => obj.username));
      });
  }

  function SelectUser(username) {
    let temp_users = JSON.parse(JSON.stringify(selectedUsers));
    // add/remove
    if (temp_users.includes(username)) {
      temp_users.splice(temp_users.indexOf(username), 1);
      let temp_annotators = JSON.parse(JSON.stringify(annotators));
      if (temp_annotators.includes(username)) {
        temp_annotators.splice(temp_annotators.indexOf(username), 1);
        if (temp_annotators.length == 0) {
          temp_annotators.push("fakeUserOnlyForRemainLengthBiggerThanOne");
        }
        setAnnotators(temp_annotators);
      }
    } else {
      temp_users.push(username);
    }
    setSelectedUsers(temp_users);
  }

  function PreSelectUser(username) {
    let temp_users = JSON.parse(JSON.stringify(selectedUsers));
    // add
    if (temp_users.includes(username) == false) {
      temp_users.push(username);
      setSelectedUsers(temp_users);
    }
  }

  useEffect(() => {
    fetch(`/api/project/get-annotators-status?project_id=${projectId}`)
      .then((response) => {
        if (response.status != 200) {
          return;
        }
        return response.json();
      })
      .then((data) => {
        setAnnotatorsStatus(data);
      });
  }, []);
  return (
    <div
      class="card"
      style={{ maxWidth: "75%", margin: "auto", padding: "20px" }}
    >
      {/* If we're in: create meta-tagging, browse meta-tagging or check correctness -> 
        we set the className to be 'hide', and we hide the content in style.css
      */}
      <div
        className={
          isCreateMetaTagging || isBrowseMetaTagging || isCheckingCorrectness
            ? "hide"
            : ""
        }
      >
        {/* Create a new project form */}
        <h2>Edit project details</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: "15px" }}>
            {projectDetailsTitle != null && (
              <div>
                <label>Project Title</label>
                <input
                  class="form-control"
                  id="exampleFormControlTextarea2"
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  defaultValue={projectDetailsTitle.title}
                />

                <div style={{ marginTop: "15px" }}>
                  {" "}
                  <label>Project Description</label>
                  <textarea
                    isEditable="true"
                    class="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    defaultValue={projectDetailsTitle.description}
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
                  Edit taggers of your project
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
                    annotators.length > 0 &&
                    users.map((user, index) => {
                      const isChecked = annotators.some(
                        (annotator) => annotator === String(user.username)
                      );
                      if (isChecked) {
                        PreSelectUser(user.username);
                      }
                      const checkboxId = `flexCheckDefault_${index}`; // Unique id for each checkbox
                      return (
                        <div class="form-check" key={index}>
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id={checkboxId}
                            defaultChecked={isChecked}
                            onClick={() => {
                              SelectUser(user.username);
                            }}
                          />
                          <label class="form-check-label" htmlFor={checkboxId}>
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
