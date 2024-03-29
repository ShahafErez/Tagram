import React, { useEffect, useState } from "react";
import { ReactSession } from "react-client-session";
import { useNavigate } from "react-router-dom";
import FileContent from "../FileContent";
import BrowseMetaTagging from "./BrowseMetaTagging";
import CorrectnessPage from "./CorrectnessPage";
import CreateMetaTagging from "./CreateMetaTagging";

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
    // getting information from sessions
    setTitle(ReactSession.get("title"));
    setDescription(ReactSession.get("description"));
    setMetaTaggingTitle(ReactSession.get("metaTaggingTitle"));
    setMetaTaggingId(ReactSession.get("metaTaggingId"));
    let selectedUsersSession = ReactSession.get("selectedUsers");
    if (selectedUsersSession != undefined) {
      setSelectedUsers(selectedUsersSession);
    }

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

    resetSessionValues();

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
        }).then((response) => {
          if (response.status == 201) {
            navigate("/manager/" + project_id);
          } else {
            console.log("error");
          }
        });
      });
  };

  /**
   * If the file format is correct-
   * Getting the text of the new uploaded file and setting it
   */
  function processFile(file) {
    let fileType = file.name.split(".")[1];
    if (fileType != "txt") {
      return;
    }

    setSelectedFile(file);

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
    ReactSession.set("metaTaggingTitle", metaTagging.title);
    ReactSession.set("metaTaggingId", metaTagging.meta_tagging_id);
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
    ReactSession.set("selectedUsers", temp_users);
  }

  function backToPage() {
    setIsCreateMetaTagging(false);
    setIsBrowseMetaTagging(false);
    setIsCheckingCorrectness(false);
  }

  function resetSessionValues() {
    ReactSession.set("title", "");
    ReactSession.set("description", "");
    ReactSession.set("metaTaggingTitle", "");
    ReactSession.set("metaTaggingId", "");
    ReactSession.set("selectedUsers", []);
  }

  return (
    <div
      class="card"
      style={{ maxWidth: "80%", margin: "auto", padding: "20px" }}
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
              onChange={(e) => {
                let title = e.target.value;
                setTitle(title);
                ReactSession.set("title", title);
              }}
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
              onChange={(e) => {
                let description = e.target.value;
                setDescription(description);
                ReactSession.set("description", description);
              }}
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <input
              type="file"
              onChange={(e) => {
                processFile(e.target.files[0]);
              }}
              style={{ marginTop: "0px" }}
            />
            <p
              style={{
                color: "#858585",
                marginBottom: "0px",
                fontSize: "15px",
              }}
            >
              Please select only "txt" files
            </p>
          </div>
          {/* if file exist- showing it in accordion display */}
          {fileContent != null && (
            <div style={{ marginTop: "15px" }}>
              <FileContent
                fileContent={fileContent}
                showCorrectness={true}
                isCheckingCorrectness={(isCheckingCorrectness) => {
                  setIsCheckingCorrectness(isCheckingCorrectness);
                }}
              />
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
                    users.map((user, index) => {
                      const isChecked =
                        selectedUsers.indexOf(user.username) == -1
                          ? false
                          : true;
                      return (
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            defaultChecked={isChecked}
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

          <div style={{ marginTop: "15px" }}>
            <button
              type="submit"
              class="btn btn-passive"
              style={{
                marginRight: "10px",
                backgroundColor: "#adb5bd",
                width: "80px",
              }}
              onClick={() => {
                setTitle("");
                setDescription("");
                setMetaTaggingTitle("");
                setMetaTaggingId("");
                setSelectedUsers([]);
                resetSessionValues();
                window.location.reload(true);
              }}
            >
              Reset
            </button>
            {/* Saving is only enabled if all required fields are inserted */}
            {title != "" &&
            metaTaggingId != "" &&
            selectedFile &&
            selectedUsers.length > 0 ? (
              <button type="submit" class="btn btn-primary">
                Save Project
              </button>
            ) : (
              <button type="submit" class="btn btn-primary disabled">
                Save Project
              </button>
            )}
          </div>
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
