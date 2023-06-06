import React, { useEffect, useState } from "react";

export default function AutomationResultsTag(props) {
  const [outputLabels, setOutputLabels] = useState();
  const [outputLabelsTypes, setOutputLabelsTypes] = useState();
  const [outputValues, setOutputValues] = useState();

  const [labelsDictionary, setLabelsDictionary] = useState();
  const [matchingLabels, setMatchingLabels] = useState([]);
  const [threshold, setThreshold] = useState("");

  const [isShowingLabels, setIsShowingLabels] = useState(false);

  const [taggers, setTaggers] = useState([]);
  const [tokensTaggersMapping, setTokensTaggersMapping] = useState();

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
    let automationResult = {};
    Object.entries(labelsDict).forEach(([key, value]) => {
      automationResult[key] = new Set(value);
    });
    setLabelsDictionary(labelsDict);
    setMatchingLabels(matchingLabels);
    processAnnotations(props.annotationsData, automationResult, matchingLabels);
  }

  function processAnnotations(data, automationResult, matchingLabels) {
    let annotationsDict = {};
    let labelsByTokenDict = {};
    let taggersList = ["automation"];

    annotationsDict["automation"] = automationResult;
    data.map((annotationsInfo, index) => {
      let taggerAnnotations = {};
      annotationsInfo.tags.map((tagInfo, idx) => {
        // creating a dict with all the selected labels
        let labelKey = tagInfo.tag.toLowerCase();
        if (matchingLabels.includes(labelKey)) {
          if (!taggerAnnotations[labelKey]) {
            taggerAnnotations[labelKey] = new Set();
          }
          if (!labelsByTokenDict[labelKey]) {
            labelsByTokenDict[labelKey] = new Set();
          }
          let tokensProcessed = tagInfo.tokens.join(" ").toLowerCase();
          taggerAnnotations[labelKey].add(tokensProcessed);
          labelsByTokenDict[labelKey].add(tokensProcessed);
        }
      });

      taggersList.push(annotationsInfo.tagger);
      annotationsDict[annotationsInfo.tagger.toLowerCase()] = taggerAnnotations;
    });
    setTaggers(taggersList);
    labelsByTokenDict = combineSets(automationResult, labelsByTokenDict);
    getAnnotationTaggersArray(labelsByTokenDict, taggersList, annotationsDict);
  }

  function combineSets(obj1, obj2) {
    if (Object.keys(obj1).length === 0) {
      return obj2;
    }
    if (Object.keys(obj2).length === 0) {
      return obj1;
    }

    let combinedObj = {};
    for (let key in obj1) {
      if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
        combinedObj[key] = new Set([...obj1[key], ...obj2[key]]);
      }
    }
    return combinedObj;
  }

  function getAnnotationTaggersArray(
    labelsByTokenDict,
    taggersList,
    annotationsDict
  ) {
    let tokensMatrix = [];
    // iterating over all labels
    Object.keys(labelsByTokenDict).forEach((label) => {
      let tokensArray = labelsByTokenDict[label];
      // iterating over all tokens in label
      tokensArray.forEach((token) => {
        let tokenArray = [label, token];
        // iterating over all taggers and checking if they annotated the token for the label
        taggersList.forEach((tagger) => {
          // all the tokens the tagger has annotated for
          let labelList = annotationsDict[tagger][label];
          if (labelList == undefined) {
            tokenArray.push(false);
          } else {
            tokenArray.push(labelList.has(token));
          }
        });
        tokensMatrix.push(tokenArray);
      });
    });
    setTokensTaggersMapping(tokensMatrix);
  }

  function renderCompareTable() {
    return (
      <div>
        <h4 style={{ fontSize: "18px", fontWeight: "500" }}>
          Comparing Annotation
        </h4>

        {tokensTaggersMapping != undefined && (
          <div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Label Type</th>
                  <th scope="col">Tokens</th>
                  {taggers.map((tagger, index) => (
                    <th key={index} scope="col">
                      {tagger}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tokensTaggersMapping.map((row, rowIndex) => {
                  return (
                    <tr key={rowIndex}>
                      {row.map((value, index) => {
                        return index === 0 || index === 1 ? (
                          <th scope="row" key={index}>
                            {value}
                          </th>
                        ) : value ? (
                          <td key={index}>
                            <i
                              class="bi bi-check-lg"
                              style={{ color: "green" }}
                            ></i>
                          </td>
                        ) : (
                          <td key={index}>
                            <i class="bi bi-x" style={{ color: "red" }}></i>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  useEffect(() => {
    if (props) {
      props.set_out_data(labelsDictionary, "tags");
    }
  });
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
                    {renderCompareTable()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
