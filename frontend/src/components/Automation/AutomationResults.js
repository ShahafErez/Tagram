import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AutomationResultsTag from "./AutomationResultsTag";
import AutomationResultsRelations from "./AutomationResultsRelations";
import AutomationResultsCoOccurrence from "./AutomationResultsCoOccurrence";

export default function AutomationResults(props) {
  let { projectId } = useParams();

  const [automationOutput, setAutomationOutput] = useState();
  const [annotationsData, setAnnotationsData] = useState();
  const [outputTotalData, setOutputTatalData] = useState({});

  const handleOutputTotalData = (data, from) => {
    console.log(data);
    if (from === "tags") {
      const newData = {
        ...outputTotalData,
        Tags: data,
      };
      console.log(newData);
      setOutputTatalData(newData);
    }
    if (from == "relations") {
      const newData = {
        ...outputTotalData,
        Relations: data,
      };
      console.log(newData);
      setOutputTatalData(newData);
    }
    if (from == "co_occurrence") {
      const newData = {
        ...outputTotalData,
        Co_Occurrence: data,
      };
      console.log(newData);
      setOutputTatalData(newData);
    }
  };
  useEffect(() => {
    // getting the automation results from the backend
    fetch("/api/project/run-user-model", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        user_model_name_: props.selectedModelName,
        file_content: props.file_content,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        setAutomationOutput(res);
        getAnnotationsData();
      });
  }, []);

  function getAnnotationsData() {
    fetch(`/api/project/get-annotation-of-project?project_id=${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        setAnnotationsData(data);
      });
  }

  function writeArraysToTxtFile() {
    const obj = outputTotalData;
    const fileName = "output.txt";
    const jsonString = JSON.stringify(obj, null, 2);
    const blob = new Blob([jsonString], { type: "text/plain;charset=utf-8" });

    if (navigator.msSaveBlob) {
      // For Internet Explorer or Microsoft Edge
      navigator.msSaveBlob(blob, fileName);
    } else {
      const link = document.createElement("a");
      if (link.download !== undefined) {
        // For modern browsers
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  return (
    <div style={{ textAlign: "center" }}>
      <h3>Automation results</h3>
      {automationOutput != undefined && (
        <div>
          <div class="accordion" id="accordionPanelsStayOpenExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Tag
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div class="accordion-body">
                  <AutomationResultsTag
                    output={automationOutput.Tag}
                    metaTagging={props.metaTagging}
                    annotationsData={annotationsData}
                    set_out_data={handleOutputTotalData}
                  />
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Relations
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div class="accordion-body">
                  <AutomationResultsRelations
                    output={automationOutput.Relations}
                    metaTagging={props.metaTagging}
                    annotationsData={annotationsData}
                    set_out_data={handleOutputTotalData}
                  />
                </div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseThree"
                >
                  Co-Occurrence
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="panelsStayOpen-headingThree"
              >
                <div class="accordion-body">
                  <AutomationResultsCoOccurrence
                    output={automationOutput.CoOccurrence}
                    annotationsData={annotationsData}
                    set_out_data={handleOutputTotalData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {Object.keys(outputTotalData).length === 3 && (
        <div>
          <button onClick={writeArraysToTxtFile}>Download Result</button>
        </div>
      )}

      <div style={{ textAlign: "left" }}>
        <button
          type="submit"
          class="btn btn-passive"
          style={{
            marginLeft: "10px",
            backgroundColor: "#adb5bd",
          }}
          onClick={() => {
            props.onBack();
          }}
        >
          Back To Algorithm Selection
        </button>
      </div>
    </div>
  );
}
