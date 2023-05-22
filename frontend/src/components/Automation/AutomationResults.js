import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FileContent from "../FileContent";
import CorrectnessPage from "../Project/CorrectnessPage";

export default function AutomationResults() {
  const [automationOutput, setAutomationOutput] = useState();
  const [outputLabels, setOutputLabels] = useState();
  const [outputLabelsTypes, setOutputLabelsTypes] = useState();
  const [outputValues, setOutputValues] = useState();

  useEffect(() => {
    // getting the automation results from the backend
    // TODO CHEN- get the 3 values as a response from an api call

    let labels = ["user", "username"];
    let labelsTypes = ["class", "attribute"];
    let values = [
      [0.8, 0.2],
      [0.2, 0.8],
    ];
    setOutputLabels(labels);
    setOutputLabelsTypes(labelsTypes);
    setOutputValues(values);
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
      {outputLabels != undefined &&
        outputLabelsTypes != undefined &&
        outputValues != undefined && (
          <div>
            <table class="table">
              <thead>
                <tr>
                  <th></th>
                  {outputLabelsTypes.map((label, index) => (
                    <th scope="col" key={index}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outputLabels.map((type, typeIndex) => (
                  <tr key={typeIndex}>
                    <th>{type}</th>
                    {outputValues[typeIndex].map((value, valueIndex) => (
                      <td key={valueIndex}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}
