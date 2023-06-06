import React, { useEffect, useState } from "react";

export default function AutomationResultsCoOccurrence(props) {
  const [outputLabels, setOutputLabels] = useState();
  const [outputValues, setOutputValues] = useState();
  const [threshold, setThreshold] = useState("");
  const [labelsArray, setLabelsArray] = useState();

  const [isShowingLabels, setIsShowingLabels] = useState(false);

  const [taggers, setTaggers] = useState([]);
  const [tokensTaggersMapping, setTokensTaggersMapping] = useState();

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
    processAnnotations(props.annotationsData, annotationsArrays);
  }

  function processAnnotations(data, automationResult) {
    let annotationsDict = {};
    let taggersList = ["automation"];
    let annotationsArrays = [];
    automationResult.forEach((automaticAnnotation) => {
      annotationsArrays.push(automaticAnnotation);
    });

    annotationsDict["automation"] = automationResult;
    data.map((annotationsInfo, index) => {
      let coOcccurrenceArray = [];
      annotationsInfo.co_occcurrence.map((coOcccurrenceInfo, idx) => {
        let allCoOcccurrenceAnnotations = coOcccurrenceInfo.flat(1);
        let tokensArray = [];
        allCoOcccurrenceAnnotations.forEach((coOcccurrenceAnnotations) => {
          tokensArray.push(coOcccurrenceAnnotations.join(" ").toLowerCase());
        });
        coOcccurrenceArray.push(tokensArray);
        if (!isArrayExists(annotationsArrays, tokensArray)) {
          annotationsArrays.push(tokensArray);
        }
      });

      taggersList.push(annotationsInfo.tagger);
      annotationsDict[annotationsInfo.tagger.toLowerCase()] =
        coOcccurrenceArray;
    });
    setTaggers(taggersList);
    getAnnotationTaggersArray(annotationsDict, annotationsArrays, taggersList);
  }

  function isArrayExists(annotationsArrays, tokensArray) {
    let isExists = false;
    annotationsArrays.forEach((annotations) => {
      if (JSON.stringify(annotations) === JSON.stringify(tokensArray)) {
        isExists = true;
      }
    });
    return isExists;
  }

  function getAnnotationTaggersArray(
    annotationsDict,
    annotationsArrays,
    taggersList
  ) {
    let tokensMatrix = [];

    annotationsArrays.forEach((annotationArray) => {
      let tokensArrayInfo = [];
      tokensArrayInfo.push(annotationArray);

      taggersList.forEach((tagger) => {
        let isTokenArrayExists = false;
        annotationsDict[tagger].forEach((taggerTokensArray) => {
          if (
            taggerTokensArray.length === annotationArray.length &&
            taggerTokensArray.every((obj) => annotationArray.includes(obj))
          ) {
            isTokenArrayExists = true;
          }
        });
        tokensArrayInfo.push(isTokenArrayExists);
      });
      tokensMatrix.push(tokensArrayInfo);
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
                  <th scope="col">Terms</th>
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
                        return index === 0 ? (
                          <th scope="row" key={index}>
                            {value.join(", ")}
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
            <div style={{ marginTop: "15px" }}>{renderCompareTable()}</div>
          )}
        </div>
      )}
    </div>
  );
}
