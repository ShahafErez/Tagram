import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CompareAnnotations(props) {
  let { projectId } = useParams();

  // console.log("000 ", props.automationResult);
  // console.log("111 ", props.matchingLabels);

  let automationResult = {};
  Object.entries(props.automationResult).forEach(([key, value]) => {
    automationResult[key] = new Set(value);
  });

  let matchingLabels = props.matchingLabels;

  const [taggers, setTaggers] = useState([]);
  const [tokensTaggersMapping, setTokensTaggersMapping] = useState();

  useEffect(() => {
    fetch(`/api/project/get-annotation-of-project?project_id=${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        processAnnotations(data);
      });
  }, []);

  function processAnnotations(data) {
    let annotationsDict = {};
    let labelsByTokenDict = {};
    // let taggersList = ["automation"];
    let taggersList = [];

    annotationsDict["automation"] = automationResult;
    data.map((annotationsInfo, index) => {
      let taggerAnnotations = {};
      //  TODO- only Tags, add Relations?
      annotationsInfo.tags.map((tagInfo, idx) => {
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
    getAnnotationTaggersArray(labelsByTokenDict, taggersList, annotationsDict);
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
          tokenArray.push(labelList.has(token));
        });
        tokensMatrix.push(tokenArray);
      });
    });
    setTokensTaggersMapping(tokensMatrix);
    console.log("tokensMatrix ", tokensMatrix);
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
                console.log("row ", row);
                console.log("rowIndex ", rowIndex);
                return (
                  <tr key={rowIndex}>
                    {row.map((value, index) => {
                      console.log("value ", value);
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
