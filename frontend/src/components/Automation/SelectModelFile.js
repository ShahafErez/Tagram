import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function SelectModelFile({ set_gobal_selectedModelName }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModelName, setSelectedModelName] = useState(null);
  const [allUserModels, setAllUserModels] = useState([]);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    // const b = document.getElementById("upload_model_button");
    // b.disabled = false;
    // setSelectedFileName(event.target.files[0].name);
  };

  useEffect(() => {
    set_gobal_selectedModelName(selectedModelName);
  }, selectedModelName);

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    fetch("/api/project/upload-user-model", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => {
        if (response.status == 405) {
          alert(
            "a model with that name already exist, please choose a model with different name."
          );
        }
        response.json();
      })
      .then((data) => {
        console.log("ok");
        window.location.reload(false);
      });
  };

  useEffect(() => {
    fetch("/api/project/get-all-usermodels-names")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setAllUserModels(data.reverse());
      });
  }, [selectedFile]);

  return (
    <div>
      <Card style={{ margin: "auto" }}>
        <Card.Body>
          <Card.Title>Please select a model</Card.Title>
          <hr></hr>
          <Row>
            <Col>
              <Card.Subtitle className="mb-2 text-muted">
                Upload a model
              </Card.Subtitle>
              <Card.Text>
                <div>
                  {" "}
                  <Row>
                    <Col>
                      <input type="file" onChange={handleFileSelect} />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        id="upload_model_button"
                        onClick={handleFileUpload}
                        // disabled={true}
                      >
                        Upload
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Text>
            </Col>
            <Col>
              <Card.Subtitle className="mb-2 text-muted">
                Select from existing models
              </Card.Subtitle>
              <Card.Text>
                {allUserModels.length > 0 && (
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
                )}
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SelectModelFile;
