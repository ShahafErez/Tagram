import React, { useEffect, useState } from "react";

export default function AutomationResults({ selectedModelName }) {
  const [automationOutput, setAutomationOutput] = useState();
  const [outputLabels, setOutputLabels] = useState();
  const [outputLabelsTypes, setOutputLabelsTypes] = useState();
  const [outputValues, setOutputValues] = useState();

  useEffect(() => {
    // getting the automation results from the backend

    fetch("/api/project/run-user-model", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        user_model_name_: selectedModelName,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        setOutputLabels(res.labels);
        setOutputLabelsTypes(res.labelsTypes);
        setOutputValues(res.values);
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
