import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateMetaTagging from "./CreateMetaTagging";
import BrowseMetaTagging from "./BrowseMetaTagging";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  let project_id;

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // page state
  const [isCreateMetaTagging, setIsCreateMetaTagging] = useState(false);
  const [isBrowseMetaTagging, setIsBrowseMetaTagging] = useState(false);

  // meta tagging
  const [metaTaggingId, setMetaTaggingId] = useState("");
  const [metaTaggingTitle, setMetaTaggingTitle] = useState("");

  // file
  const [selectedFile, setSelectedFile] = useState(null);

  /** Handeles saving the project deatil
   * Sends details to the backend
   */
  const handleSubmit = (e) => {
    // prevent the page from re-loading after submit
    e.preventDefault();

    console.log("meta taggin id :", metaTaggingId);

    fetch("/api/project/create", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        title: title,
        description: description,
        meta_tagging: metaTaggingId,
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
        //Request made to the backend api Send formData object
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
  }

  return (
    <div
      class="card"
      style={{ maxWidth: "75%", margin: "auto", padding: "20px" }}
    >
      {/* If we're in the create meta-tagging or browse meta-tagging -> 
        we set the className to be 'hide', and we hide the content in style.css
      */}
      <div className={isCreateMetaTagging || isBrowseMetaTagging ? "hide" : ""}>
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
            onChange={(e) => setSelectedFile(e.target.files[0])}
            style={{ marginTop: "15px" }}
          />
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
          <div>
            {/* TODO- add when users are added */}
            <label>Add Members</label>
            <i
              class="bi bi-person-add fa-6x"
              style={{ fontSize: "25px", marginLeft: "8px" }}
            ></i>
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

      {/* If we're in create or browse- we'll call that component */}
      {isCreateMetaTagging && (
        <CreateMetaTagging onSave={savedMetaTagging} onBack={backToPage} />
      )}
      {isBrowseMetaTagging && (
        <div>
          <div style={{ display: "none" }}>createProjectForm()</div>
          <BrowseMetaTagging onSave={savedMetaTagging} onBack={backToPage} />
        </div>
      )}
    </div>
  );
}
