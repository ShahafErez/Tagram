import React, { useEffect, useState } from "react";
import CompareAnnotationsCoOccurrence from "./CompareAnnotationsCoOccurrence";

export default function AutomationResultsCoOccurrence(props) {
  const [outputLabels, setOutputLabels] = useState();
  const [outputValues, setOutputValues] = useState();
  const [threshold, setThreshold] = useState("");
  const [labelsArray, setLabelsArray] = useState();

  const [isShowingLabels, setIsShowingLabels] = useState(false);

  useEffect(() => {
    let labelsProcessed = [];
    props.output.labels.forEach((labelArray) => {
      let labelArrayProcessed = [];
      labelArray.forEach((label) => {
        if (Array.isArray(label)) {
          label = label.join(" ");
        }
        labelArrayProcessed.push(label);
      });
      labelsProcessed.push(labelArrayProcessed);
    });
    setOutputLabels(labelsProcessed);
    setOutputValues(props.output.values);
  }, []);

  function filterByThreshold() {
    let annotationsArrays = [];
    outputValues.map((value, index) => {
      if (value >= threshold) {
        annotationsArrays.push(outputLabels[index]);
      }
    });
    setLabelsArray(annotationsArrays);
  }

  useEffect(() => {
    if (props) {
      props.set_out_data(labelsArray, "co_occurrence");
    }
  }, [labelsArray]);
  return (
    <div style={{ textAlign: "center" }}>
      {outputValues != undefined && (
        <div>
          <h4>Co Occurrence</h4>
          output result table
          <table class="table">
            <thead>
              <tr>
                <th>Term</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {outputLabels.map((term, index) => (
                <tr key={index}>
                  <td>{term.join(", ")}</td>
                  <td>{outputValues[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <label>Please select a threshold</label>
          <input
            class="form-control"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            placeholder="Please select a nubmer between 0 and 1"
            style={{ width: "60%", margin: "auto" }}
          />
          {threshold != "" && threshold >= 0 && threshold <= 1 ? (
            <button
              type="button"
              class="btn btn-secondary"
              onClick={() => {
                filterByThreshold();
                setIsShowingLabels(true);
              }}
            >
              Submit
            </button>
          ) : (
            <button type="button" class="btn btn-secondary disabled">
              Submit
            </button>
          )}
          {isShowingLabels && (
            <div style={{ marginTop: "15px" }}>
              <CompareAnnotationsCoOccurrence
                automationResult={labelsArray}
                annotationsData={props.annotationsData}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
