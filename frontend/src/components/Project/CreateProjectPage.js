import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  let project_id;

  const [selectedFile, setSelectedFile] = useState(null);

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
        project_id = data.project_id;
        console.log("project_id: "+project_id);
    // Create an object of formData
    const formData = new FormData();
    formData.append("myFile", selectedFile, selectedFile.name);
    formData.append("project_id", project_id);
    console.log(selectedFile);
    console.log(formData);
    //Request made to the backend api Send formData object
    //axios.post("api/project/uploadfile", formData);
    fetch("/api/project/uploadfile",
    {
      method: "POST",
      headers: {
        'Accept': 'application/json'
    },
      body: formData,
    })
  })   
  .then(()=>navigate("/project/" +project_id))
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
        <input type="file"  onChange={(e) => setSelectedFile( e.target.files[0]) }/>
        <button
          type="submit"
          class="btn btn-primary"
          style={{ marginTop: "15px" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
