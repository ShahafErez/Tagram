import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function SelectModelFile({ set_gobal_selectedModelName }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModelName, setSelectedModelName] = useState(null);
  const [allUserModels, setAllUserModels] = useState([]);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    // setSelectedFileName(event.target.files[0].name);
  };

  useEffect(() => {
    set_gobal_selectedModelName(selectedModelName);
  }, selectedModelName);

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    // TODO: add more and send to back
    fetch("/api/project/upload-user-model", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ok");
      });
  };

  const runmodel = () => {
    console.log(selectedFile.name);
    fetch("/api/project/run-user-model", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        user_model_name_: selectedFile.name,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
      });
  };

  useEffect(() => {
    fetch("/api/project/get-all-usermodels-names")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAllUserModels(data);
      });
  }, [selectedFile]);

  return (
    <div>
      {/* <label>Please select a model</label>
      <label>Upload a model</label>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleFileUpload}>Upload</button> */}
      {/* <button onClick={runmodel}>RUN</button> */}

      {/* <label>Select from existing models</label> */}

      {/* <select
        class="form-select"
        size="3"
        aria-label="size 3 select example"
        onChange={(e) => setSelectedFileName(e.target.value)}
        style={{ marginTop: "5px" }}
      >
        {allUserModels.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select> */}

      <Form>
        <Form.Text>
          <h1>Please select a model</h1>
        </Form.Text>
        <Form.Group className="mb-3">
          <Form.Label>Upload a model</Form.Label>
          <div>
            {" "}
            <input type="file" onChange={handleFileSelect} />
            <Button onClick={handleFileUpload}>Upload</Button>
          </div>

          {/* <Form.Text className="text-muted">select only .jar files</Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Select from existing models</Form.Label>{" "}
          <select
            class="form-select"
            size="3"
            aria-label="size 3 select example"
            onChange={(e) => setSelectedModelName(e.target.value)}
            style={{ marginTop: "5px" }}
          >
            {allUserModels.map((model, index) => (
              <option key={index} value={model}>
                {model}
              </option>
            ))}
          </select>
        </Form.Group>
      </Form>
    </div>
  );
}

export default SelectModelFile;
