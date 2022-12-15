import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateMetaTagging from "./CreateMetaTagging";

export default function CreateProjectPage() {
  const navigate = useNavigate();

  // project details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // page state
  const [isCreateMetaTagging, setIsCreateMetaTagging] = useState(false);
  const [isBrowseMetaTagging, setIsBrowseMetaTagging] = useState(false);

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
        title,
        description,
      }),
    })
      .then((response) => response.json())
      .then((data) => navigate("/project/" + data.project_id));
  };

  /* Returns the main create project form*/
  const createProjectForm = () => {
    return (
      <div>
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
          <div style={{ marginTop: "15px" }}>
            <label>Add Meta-Tagging</label>
            <div style={{ marginTop: "5px" }}>
              <button
                type="submit"
                class="btn btn-outline-secondary"
                onClick={() => setIsBrowseMetaTagging(true)}
              >
                Browse existing meta-tagging
              </button>
              <button
                type="submit"
                class="btn btn-outline-secondary"
                onClick={() => setIsCreateMetaTagging(true)}
                style={{ marginLeft: "20px", width: "238px" }}
              >
                Create new meta-tagging
              </button>
            </div>
          </div>
          <div style={{ marginTop: "15px" }}>
            {/* todo- add when users are added */}
            <label>Add Members</label>
            <i
              class="bi bi-person-add fa-6x"
              style={{ fontSize: "25px", marginLeft: "8px" }}
            ></i>
          </div>
          {/* todo- check if meta tagging is selected */}
          <button
            type="submit"
            class="btn btn-primary"
            onClick={() => handleSubmit()}
            style={{ marginTop: "15px" }}
          >
            Save
          </button>
        </form>
      </div>
    );
  };

  /** Function that called when the meta tagging is being saved
   */
  function savedMetaTagging(metaTaggingId) {
    console.log(metaTaggingId);
    setIsCreateMetaTagging(false);

    // todo- add meta tagging in backend
  }

  function backToPage() {
    console.log("back to page without saving");
    setIsCreateMetaTagging(false);
  }

  return (
    <div
      class="card"
      style={{ maxWidth: "70%", margin: "auto", padding: "20px" }}
    >
      {!isCreateMetaTagging && !isBrowseMetaTagging && createProjectForm()}
      {isCreateMetaTagging && (
        <CreateMetaTagging onSave={savedMetaTagging} onBack={backToPage} />
      )}
      {/* {isBrowseMetaTagging && handleBrowseMetaTagging()} */}
    </div>
  );
}
