import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import CreateMetaTagging from "./CreateMetaTagging";
import BrowseMetaTagging from "./BrowseMetaTagging";
import CorrectnessPage from "./CorrectnessPage";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  let username = ReactSession.get("username");
  let project_id;

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // page states
  const [isCreateMetaTagging, setIsCreateMetaTagging] = useState(false);
  const [isBrowseMetaTagging, setIsBrowseMetaTagging] = useState(false);
  const [isCheckingCorrectness, setIsCheckingCorrectness] = useState(false);

  // meta tagging
  const [metaTaggingId, setMetaTaggingId] = useState("");
  const [metaTaggingTitle, setMetaTaggingTitle] = useState("");

  // file
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  // getting all users for selecting users to project
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

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
    })
      // Adding the new file to the project
      .then((response) => response.json())
      .then((data) => {
        project_id = data.project_id;
        // Create an object of formData
        const formData = new FormData();
        formData.append("myFile", selectedFile, selectedFile.name);
        formData.append("project_id", project_id);
        fetch("/api/project/uploadfile", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });
      })
      .then(() => {
        fetch("/api/users/create-user-project-mapping", {
          method: "POST",
          headers: { "Content-Type": "application/json ; charset=utf-8" },
          body: JSON.stringify({
            project: project_id,
            user: selectedUsers,
          }),
        });
      })
      .then(() => navigate("/project/" + project_id));
  };

  /** Getting the text of the new uploaded file
   * Doesn't save file in database
   */
  function getFileContent(file) {
    const formData = new FormData();
    formData.append("myFile", file, "new_file");

    fetch("/api/project/get-file-content", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        let textArray = [];
        data.split("\n").map((element, index) => {
          textArray.push(element.trim());
        });
        setFileContent(textArray);
      });
  }

  /** Meta tagging is being saved */
  function saveMetaTagging(metaTagging) {
    setIsCreateMetaTagging(false);
    setIsBrowseMetaTagging(false);
    setMetaTaggingTitle(metaTagging.title);
    setMetaTaggingId(metaTagging.meta_tagging_id);
  }

  /** Updated file content is being saved
   * This function will be called from the "CorrectnessPage" component
   */
  function saveFileContent(newFileContent) {
    let newFileArray = [];
    newFileContent.textArray.map((story, index) => {
      if (story != "") {
        newFileArray.push(story + "\n");
      }
    });
    const newFile = new Blob(newFileArray, {
      type: "text/plain",
    });
    setFileContent(newFileArray);
    setSelectedFile(newFile);
    setIsCheckingCorrectness(false);
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
        <h2>Create a new project</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: "15px" }}>
            <label>Project Title</label>
            <input
              class="form-control"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            {" "}
            <label>Project Description</label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              value={description}
              placeholder="Your project description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <input
            type="file"
            onChange={(e) => {
              getFileContent(e.target.files[0]);
              setSelectedFile(e.target.files[0]);
            }}
            style={{ marginTop: "15px" }}
          />
          {/* if file exist- showing it in accordion display */}
          {fileContent != null && (
            <div
              class="accordion"
              id="accordionExample"
              style={{ marginTop: "15px" }}
            >
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Uploaded user stories
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    <div>
                      <ol class="list-group" style={{ marginLeft: "10px" }}>
                        {fileContent.map((element, index) => (
                          <li
                            style={{ paddingLeft: "4px", paddingRight: "6px" }}
                          >
                            {element}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {fileContent != null && (
            <div style={{ marginTop: "10px" }}>
              <button
                type="submit"
                class="btn btn-outline-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCheckingCorrectness(true);
                }}
              >
                Edit stories & Check correctness
                <i
                  class="bi bi-pencil-square"
                  style={{ marginLeft: "8px" }}
                ></i>
              </button>
            </div>
          )}

          <div style={{ marginTop: "15px" }}>
            <label>Add Meta-Tagging</label>
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
                    users.map((user, index) => (
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
                        <label class="form-check-label" for="flexCheckDefault">
                          {user.username}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Saving is only enabled if all required fields are inserted */}
          {title != "" &&
          metaTaggingId != "" &&
          selectedFile &&
          selectedUsers.length > 0 ? (
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
      {isCheckingCorrectness && (
        <CorrectnessPage
          file={fileContent}
          onSave={saveFileContent}
          onBack={backToPage}
        />
      )}
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
