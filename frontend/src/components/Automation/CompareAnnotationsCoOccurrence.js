import React, { useEffect, useState } from "react";

export default function CompareAnnotationsCoOccurrence(props) {
  let annotationsData = props.annotationsData;
  let automationResult = props.automationResult;

  const [taggers, setTaggers] = useState([]);
  const [tokensTaggersMapping, setTokensTaggersMapping] = useState();

  useEffect(() => {
    processAnnotations(annotationsData);
  }, []);

  function processAnnotations(data) {
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
