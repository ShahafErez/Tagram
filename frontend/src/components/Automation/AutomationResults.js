import React, { useEffect, useState } from "react";
import CompareAnnotations from "./CompareAnnotations";

export default function AutomationResults(props) {
  let model = props.model;

  const [outputLabels, setOutputLabels] = useState();
  const [outputLabelsTypes, setOutputLabelsTypes] = useState();
  const [outputValues, setOutputValues] = useState();

  const [matchingLabels, setMatchingLabels] = useState([]);
  const [isShowingLabels, setIsShowingLabels] = useState(false);

  const [threshold, setThreshold] = useState("");

  useEffect(() => {
    // getting the automation results from the backend
    // TODO CHEN- get the 3 values as a response from an api call

    let labels = [["able", "to"], "username", "user"];
    let labelsTypes = ["class", "attribute", "blabla"];
    let values = [
      [0.8, 0.2, 0.9],
      [0.2, 0.8, 0.1],
      [0.5, 0.2, 0.8],
    ];
    let labelsProcessed = [];
    labels.map((label, index) => {
      if (Array.isArray(label)) {
        label = label.join(" ");
      }
      labelsProcessed.push(label);
    });
    setOutputLabels(labelsProcessed);
    setOutputLabelsTypes(labelsTypes);
    setOutputValues(values);
  }, []);

  function filterByThreshold() {
    let labelsDict = [];
    outputValues.map((valueArray, labelIndex) => {
      valueArray.map((value, labelTypeIndex) => {
        if (value >= threshold) {
          let key = outputLabelsTypes[labelTypeIndex];
          let dictValue = outputLabels[labelIndex];

          if (!labelsDict.hasOwnProperty(key)) {
            labelsDict[key] = [];
          }
          labelsDict[key].push(dictValue);
        }
      });
    });
    checkMetaTagging(labelsDict);
  }

  function checkMetaTagging(labelsDict) {
    let metaTaggings = props.metaTagging;
    let metaTaggingLabels = [];
    metaTaggings.map((label, index) => {
      // TODO- change?
      if (label.type == "Tag") {
        metaTaggingLabels.push(label.name.toLowerCase());
      }
    });

    let matchingLabels = [];
    for (let label in labelsDict) {
      if (!metaTaggingLabels.includes(label.toLowerCase())) {
        delete labelsDict[label];
      } else {
        matchingLabels.push(label);
      }
    }
    setMatchingLabels(matchingLabels);
  }

  return (
    <div style={{ textAlign: "center" }}>
      {outputLabels != undefined &&
        outputLabelsTypes != undefined &&
        outputValues != undefined && (
          <div>
            <h3>Automation result</h3>

            {/* output result table */}
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

            {isShowingLabels && matchingLabels != undefined && (
              <div>
                <div style={{ width: "60%", margin: "auto" }}>
                  <ul class="list-group">
                    <p style={{ marginTop: "15px", marginBottom: "5px" }}>
                      Matching labels from meta tagging:
                    </p>
                    {matchingLabels.map((label, index) => {
                      return <li class="list-group-item">{label}</li>;
                    })}
                  </ul>
                  <div style={{ marginTop: "15px" }}>
                    <CompareAnnotations />
                  </div>
                </div>
              </div>
            )}
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
