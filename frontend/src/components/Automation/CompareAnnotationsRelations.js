import React, { useEffect, useState } from "react";

export default function CompareAnnotationsRelations(props) {
  let automationResult = {};
  Object.entries(props.automationResult).forEach(([key, value]) => {
    automationResult[key] = new Set(value);
  });

  let matchingLabels = props.matchingLabels;
  let annotationsData = props.annotationsData;

  const [taggers, setTaggers] = useState([]);
  const [tokensTaggersMapping, setTokensTaggersMapping] = useState();

  useEffect(() => {
    processAnnotations(annotationsData);
  }, []);

  function processAnnotations(data) {
    let annotationsDict = {};
    let labelsByTokenDict = {};
    let taggersList = ["automation"];

    annotationsDict["automation"] = automationResult;
    data.map((annotationsInfo, index) => {
      let taggerAnnotations = {};
      annotationsInfo.relations.map((relationsInfo, idx) => {
        let labelKey = relationsInfo.tag.toLowerCase();
        if (matchingLabels.includes(labelKey)) {
          if (!taggerAnnotations[labelKey]) {
            taggerAnnotations[labelKey] = new Set();
          }
          if (!labelsByTokenDict[labelKey]) {
            labelsByTokenDict[labelKey] = new Set();
          }
          let tokensArray = [
            relationsInfo.From.tokens.join(" ").toLowerCase(),
            relationsInfo.To.tokens.join(" ").toLowerCase(),
          ];
          taggerAnnotations[labelKey].add(tokensArray);
          labelsByTokenDict[labelKey].add(tokensArray);
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
      tokensArray.forEach((tokens) => {
        let tokenArray = [label, tokens];
        // iterating over all taggers and checking if they annotated the token for the label
        taggersList.forEach((tagger) => {
          // all the tokens the tagger has annotated for
          let labelList = annotationsDict[tagger][label];
          let isPresend;
          if (annotationsDict[tagger][label] == undefined) {
            isPresend = false;
          } else {
            isPresend = Array.from(labelList).some(
              (arr) => JSON.stringify(arr) === JSON.stringify(tokens)
            );
          }
          tokenArray.push(isPresend);
        });
        tokensMatrix.push(tokenArray.flat(1));
      });
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
                <th scope="col">Label Type</th>
                <th scope="col">Term 1</th>
                <th scope="col">Term 2</th>
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
                      return index === 0 || index === 1 || index === 2 ? (
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
