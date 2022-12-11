import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // prevent the page from re-loading after submit
    e.preventDefault();
    setIsPending(true);

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
        setIsPending(false);
        navigate("/project/" + data.project_id);
      });
  };

  return (
    <div>
      <h2>Welcome to Create project func!</h2>
      <form onSubmit={handleSubmit}>
        <label>Project Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>Project Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {!isPending && <button>Save</button>}
        {isPending && <button disabled>Adding project..</button>}
      </form>
    </div>
  );
}
