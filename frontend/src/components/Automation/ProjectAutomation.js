import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FileContent from "../FileContent";
import MetaTaggingObject from "../Project/MetaTaggingObject";
import AutomationResults from "./AutomationResults";
import SelectModelFile from "./SelectModelFile";
import Card from "react-bootstrap/Card";

export default function ProjectAutomation() {
  let { projectId } = useParams();

  const [isAutomaticResults, setIsAutomaticResults] = useState(false);

  const [selectedModel, setSelectedModel] = useState();
  const [metaTaggingLabels, setMetaTaggingLabels] = useState([]);
  const [projectTitle, setProjectTitle] = useState();
  const [fileContent, setFileContent] = useState(null);
  const [selectedModelName, set_gobal_selectedModelName] = useState(null);

  useEffect(() => {
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
      {!isAutomaticResults && (
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

          <Card>
            <SelectModelFile
              set_gobal_selectedModelName={set_gobal_selectedModelName}
            />
          </Card>

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
            {selectedModelName == null ? (
              <button type="button" class="btn btn-primary disabled">
                Get Automatic Annotation
              </button>
            ) : (
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => {
                  setIsAutomaticResults(true);
                }}
              >
                Get Automatic Annotation
              </button>
            )}
          </div>
        </div>
      )}

      {isAutomaticResults && (
        <div>
          <AutomationResults
            selectedModelName={selectedModelName}
            metaTagging={metaTaggingLabels}
            onBack={() => {
              setIsAutomaticResults(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
