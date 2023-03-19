import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSession } from "react-client-session";
import CreateMetaTagging from "./CreateMetaTagging";
import BrowseMetaTagging from "./BrowseMetaTagging";
import CorrectnessPage from "./CorrectnessPage";

export default function CreateProjectPage() {
  let username = ReactSession.get("username");
  console.log("create project page, username: ", username);

  const navigate = useNavigate();
  let project_id;

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // page state
  const [isCreateMetaTagging, setIsCreateMetaTagging] = useState(false);
  const [isBrowseMetaTagging, setIsBrowseMetaTagging] = useState(false);
  const [isCheckingCorrectness, setIsCheckingCorrectness] = useState(false);

  // meta tagging
  const [metaTaggingId, setMetaTaggingId] = useState("");
  const [metaTaggingTitle, setMetaTaggingTitle] = useState("");

  // file
  const [selectedFile, setSelectedFile] = useState(null);

  // users
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("getting uers");
    fetch("/api/users/get-all")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  /** Handeles saving the project deatil
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
      .then((response) => response.json())
      .then((data) => {
        project_id = data.project_id;
        console.log("project_id: " + project_id);
        // Create an object of formData
        const formData = new FormData();
        formData.append("myFile", selectedFile, selectedFile.name);
        formData.append("project_id", project_id);
        console.log(selectedFile);
        console.log(formData);
        // Request made to the backend api Send formData object
        fetch("/api/project/uploadfile", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });
      })
      .then(() => navigate("/project/" + project_id));
  };

  function setCurrentFile(selectedFile) {
    console.log("1 ", selectedFile);
    const formData = new FormData();
    formData.append("myFile", selectedFile, selectedFile.name);
    formData.append("project_id", project_id);
    console.log(formData);
    let textArray = formData.text.split("\n");
    console.log("textArray ", textArray);
  }

  /** Function that called when the meta tagging is being saved
   */
  function savedMetaTagging(metaTagging) {
    setIsCreateMetaTagging(false);
    setIsBrowseMetaTagging(false);
    setMetaTaggingTitle(metaTagging.title);
    setMetaTaggingId(metaTagging.meta_tagging_id);
  }

  function backToPage() {
    console.log("back to page without saving");
    setIsCreateMetaTagging(false);
    setIsBrowseMetaTagging(false);
    setIsCheckingCorrectness(false);
  }

  return (
    <div
      class="card"
      style={{ maxWidth: "75%", margin: "auto", padding: "20px" }}
    >
      {/* If we're in the create meta-tagging or browse meta-tagging or check correctness -> 
        we set the className to be 'hide', and we hide the content in style.css
      */}
      <div
        className={
          isCreateMetaTagging || isBrowseMetaTagging || isCheckingCorrectness
            ? "hide"
            : ""
        }
      >
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
              setCurrentFile(e.target.files[0]);

              setSelectedFile(e.target.files[0]);
            }}
            style={{ marginTop: "15px" }}
          />
          {selectedFile != null && (
            <div style={{ marginTop: "10px" }}>
              <button
                type="submit"
                class="btn btn-outline-success"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCheckingCorrectness(true);
                }}
              >
                Check user stories correctness
                <i class="bi bi-check-circle" style={{ marginLeft: "8px" }}></i>
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

          {/* TODO- check if meta tagging is selected */}
          <button
            type="submit"
            class="btn btn-primary"
            style={{ marginTop: "15px" }}
          >
            Save
          </button>
        </form>
      </div>

      {/* Calling the component the user has clicked on */}
      {isCheckingCorrectness && (
        <CorrectnessPage file={selectedFile} onBack={backToPage} />
      )}
      {isCreateMetaTagging && (
        <CreateMetaTagging onSave={savedMetaTagging} onBack={backToPage} />
      )}
      {isBrowseMetaTagging && (
        <div>
          <BrowseMetaTagging onSave={savedMetaTagging} onBack={backToPage} />
        </div>
      )}
    </div>
  );
}
