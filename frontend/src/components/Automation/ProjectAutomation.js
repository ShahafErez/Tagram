import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileContent from "../FileContent";
import MetaTaggingObject from "../Project/MetaTaggingObject";
import AutomationResults from "./AutomationResults";
import SelectModelFile from "./SelectModelFile";

export default function ProjectAutomation() {
  let { projectId } = useParams();

  const [isCheckingCorrectness, setIsCheckingCorrectness] = useState(false);
  const [isAutomaticResults, setIsAutomaticResults] = useState(false);

  const [selectedModel, setSelectedModel] = useState();
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [projectTitle, setProjectTitle] = useState();
  const [fileContent, setFileContent] = useState(null);
  const [selectedModelName, set_gobal_selectedModelName] = useState(null);

  useEffect(() => {
    // TODO CHEN- get list of all models from an api call
    // TODO CHEN- upload a algorithm

    // getting the meta model information
    let meta_tagging_id = "";
    fetch("/api/project/get?project_id=" + projectId)
      .then((response) => response.json())
      .then((data) => {
        meta_tagging_id = data.meta_tagging;
        setProjectTitle(data.title);
      })
      .then(() =>
        fetch(
          "/api/meta-tagging/labels-by-id?meta-tagging-id=" + meta_tagging_id
        )
      )
      .then((response) => response.json())
      .then((data) => {
        setMetaTaggingLabels(data);
      });

    // getting the file
    fetch("/api/project/get-file?project_id=" + projectId)
      .then((response) => {
        if (!response.ok) {
          console.log("response not OK");
        }
        return response.json();
      })
      .then((data) => {
        let textArray = data.text.split("\n");
        setFileContent(textArray);
      });
  }, []);

  return (
    <div
      class="card project-page"
      style={{
        paddingTop: "10px",

        width: "80%",
        margin: "auto",
        minHeight: "500px",
        padding: "15px",
      }}
    >
      {/* main automation page */}
      {!isCheckingCorrectness && !isAutomaticResults && (
        <div>
          {projectTitle != null && (
            <h2
              style={{
                margintTop: "5px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Automation- {projectTitle}
            </h2>
          )}

          {/* TODO- get from backend */}
          {/* <select
            class="form-select"
            size="3"
            aria-label="size 3 select example"
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ marginTop: "5px" }}
          >
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select> */}
          <SelectModelFile
            set_gobal_selectedModelName={set_gobal_selectedModelName}
          />

          {/* showing the selected meta-model */}
          <div style={{ marginTop: "15px" }}>
            <label>Meta-Model</label>
            {metaTaggingLabels.length > 0 && (
              <MetaTaggingObject metaTagging={metaTaggingLabels} />
            )}
          </div>

          {/* showing the selected file */}
          <div style={{ marginTop: "15px" }}>
            <label>File content</label>
            {fileContent != null && (
              <FileContent
                fileContent={fileContent}
                showCorrectness={false}
                isCheckingCorrectness={() => {}}
              />
            )}
          </div>

          {/* getting automatic results */}
          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              class="btn btn-primary"
              onClick={() => {
                setIsAutomaticResults(true);
              }}
            >
              Get Automatic Annotation
            </button>
          </div>
        </div>
      )}

      {isAutomaticResults && (
        <div>
          <AutomationResults
            selectedModelName={selectedModelName}
            backToPage={() => {
              setIsAutomaticResults(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
