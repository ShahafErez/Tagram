import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import CreateMetaTagging from "../Project/CreateMetaTagging";
import BrowseMetaTagging from "../Project/BrowseMetaTagging";
import CorrectnessPage from "../Project/CorrectnessPage";

export default function EditProjectPage(props) {
  const navigate = useNavigate();
  let username = ReactSession.get("username");
  let project = props;
  let projectName = props.projectName;

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [annotators, setAnnotators] = useState([]);
  const [annotatorsStatus, setAnnotatorsStatus] = useState();

  // page states
  const [isCreateMetaTagging, setIsCreateMetaTagging] = useState(false);
  const [isBrowseMetaTagging, setIsBrowseMetaTagging] = useState(false);
  const [isCheckingCorrectness, setIsCheckingCorrectness] = useState(false);

  // meta tagging
  const [metaTaggingId, setMetaTaggingId] = useState("");
  const [metaTaggingTitle, setMetaTaggingTitle] = useState("");

  // getting all users for selecting users to project
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  /* useEffects */
  useEffect(() => {
    //set project's annotators array
    getUsersByProject();
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

    fetch("/api/project/create", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        title: title,
        description: description,
        meta_tagging: metaTaggingId,
        project_manager: username,
      }),
    }).then(() => {
      fetch("/api/users/create-user-project-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json ; charset=utf-8" },
        body: JSON.stringify({
          project: project_id,
          user: selectedUsers,
        }),
      }).then((response) => {
        if (response.status == 201) {
        } else {
          console.log("error");
        }
      });
    });
  };

  /* General */
  function getUsersByProject() {
    // get all annotators in project
    fetch("/api/users/users-by-project/?project=" + props.project_id)
      .then((response) => response.json())
      .then((data) => {
        // get users annotation
        setAnnotators(data.map((obj) => obj.username));
      });
  }

  /** Meta tagging is being saved */
  function saveMetaTagging(metaTagging) {
    setIsCreateMetaTagging(false);
    setIsBrowseMetaTagging(false);
    setMetaTaggingTitle(metaTagging.title);
    setMetaTaggingId(metaTagging.meta_tagging_id);
  }

  function SelectUser(username) {
    let temp_users = JSON.parse(JSON.stringify(selectedUsers));
    // add/remove
    if (temp_users.includes(username)) {
      temp_users.splice(temp_users.indexOf(username), 1);
    } else {
      temp_users.push(username);
    }
    setSelectedUsers(temp_users);
  }

  function backToPage() {
    setIsCreateMetaTagging(false);
    setIsBrowseMetaTagging(false);
    setIsCheckingCorrectness(false);
  }

  useEffect(() => {
    fetch(`/api/project/get-annotators-status?project_id=${props.project_id}`)
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
            <label>Project Title</label>
            <input
              class="form-control"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your project name"
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            {" "}
            <label>Project Description</label>
            <textarea
              isEditable="true"
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              defaultValue="todo insert desc"
              value={description}
              placeholder="Your project description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <label>Replace Meta-Tagging</label>
            <div style={{ marginTop: "5px" }}>
              <button
                type="submit"
                class="btn btn-outline-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsBrowseMetaTagging(true);
                }}
              >
                Browse existing meta-tagging
              </button>
              <button
                type="submit"
                class="btn btn-outline-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCreateMetaTagging(true);
                }}
                style={{ marginLeft: "20px", width: "238px" }}
              >
                Create new meta-tagging
              </button>
            </div>
            {/* Displaying a message that states if mega-tagging was selected */}
            {metaTaggingTitle == "" && (
              <p
                style={{
                  color: "#858585",
                  margin: "2px 0 2px 0",
                  fontSize: "15px",
                }}
              >
                You don't have meta-tagging in your project yet
              </p>
            )}
            {metaTaggingTitle != "" && (
              <p
                style={{
                  color: "#858585",
                  margin: "2px 0 2px 0",
                  fontSize: "15px",
                }}
              >
                You choose the meta-tagging <b>{metaTaggingTitle}</b>
              </p>
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
          {title != "" && metaTaggingId != "" && selectedUsers.length > 0 ? (
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
      {isCreateMetaTagging && (
        <CreateMetaTagging onSave={saveMetaTagging} onBack={backToPage} />
      )}
      {isBrowseMetaTagging && (
        <div>
          <BrowseMetaTagging onSave={saveMetaTagging} onBack={backToPage} />
        </div>
      )}
    </div>
  );
}
