import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addMetaTagging, setaddMetaTagging] = useState(false);

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
      .then((data) => {
        if (addMetaTagging) {
          navigate("/meta/" + data.project_id);
        } else {
          navigate("/project/" + data.project_id);
        }
      });
  };

  return (
    <div style={{ maxWidth: "40%", margin: "auto" }}>
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
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => setaddMetaTagging(false)}
          style={{ marginTop: "15px" }}
        >
          Submit
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          onClick={() => setaddMetaTagging(true)}
          style={{ marginTop: "15px", marginLeft: "20px" }}
        >
          Submit and add meta-tagging
        </button>
      </form>
    </div>
  );
}
