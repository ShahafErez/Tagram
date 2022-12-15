import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreateMetaTagging, setIsCreateMetaTagging] = useState(false);
  const [isBrowseMetaTagging, setIsBrowseMetaTagging] = useState(false);

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
      // redirecting to the project page after creation
      .then((response) => response.json())
      .then((data) => navigate("/project/" + data.project_id));
  };

  const handleCreateMetaTagging = () => {
    // setIsCreateMetaTagging(true);
    return <div>CREATE META TAGGING</div>;
  };

  const handleBrowseMetaTagging = () => {
    // setIsBrowseMetaTagging(true);
    return <div>BROWSE META TAGGING</div>;
  };

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
            <label>Add Members</label>
            <i
              class="bi bi-person-add fa-6x"
              style={{ fontSize: "25px", marginLeft: "8px" }}
            ></i>
          </div>
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

  return (
    <div
      class="card"
      style={{ maxWidth: "70%", margin: "auto", padding: "20px" }}
    >
      {!isCreateMetaTagging && !isBrowseMetaTagging && createProjectForm()}
      {isCreateMetaTagging && handleCreateMetaTagging()}
      {isBrowseMetaTagging && handleBrowseMetaTagging()}
    </div>
  );
}
