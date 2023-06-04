import React, { useEffect, useState } from "react";
import CompareAnnotationsTag from "./CompareAnnotationsTag";

export default function AutomationResultsTag(props) {
  const [outputLabels, setOutputLabels] = useState();
  const [outputLabelsTypes, setOutputLabelsTypes] = useState();
  const [outputValues, setOutputValues] = useState();

  const [matchingLabels, setMatchingLabels] = useState([]);
  const [labelsDictionary, setLabelsDictionary] = useState();
  const [threshold, setThreshold] = useState("");

  const [isShowingLabels, setIsShowingLabels] = useState(false);

  useEffect(() => {
    let labelsProcessed = [];
    props.output.labels.map((label, index) => {
      if (Array.isArray(label)) {
        label = label.join(" ");
      }
      labelsProcessed.push(label);
    });
    setOutputLabels(labelsProcessed);
    setOutputLabelsTypes(props.output.labelsTypes);
    setOutputValues(props.output.values);
  }, []);

  function filterByThreshold() {
    let labelsDict = {};
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
    setLabelsDictionary(labelsDict);
    setMatchingLabels(matchingLabels);
  }

  return (
    <div style={{ textAlign: "center" }}>
      {outputLabels != undefined &&
        outputLabelsTypes != undefined &&
        outputValues != undefined && (
          <div>
            <h4>Tags</h4>

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
                    <CompareAnnotationsTag
                      automationResult={labelsDictionary}
                      matchingLabels={matchingLabels}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
