import React, { useEffect, useState } from "react";
import ProjectRelationTable from "./ProjectRelationTable";
import ProjectTagTable from "./ProjectTagTable";

export default function ProjectStatistics(props) {
  let project_id = props.project_id;

  const [annotators, setAnnotators] = useState([]);
  const [tagsForAlgorithm, setTagsForAlgorithm] = useState([]);
  const [relationsForAlgorithm, setRelationsForAlgorithm] = useState([]);

  // tags
  const [UsersTagsAnnotationStatistics, setUsersTagsAnnotationStatistics] =
    useState({});
  const [tagKappa, setTagKappa] = useState({});

  // relations
  const [
    UsersRelationsAnnotationStatistics,
    setUsersRelationsAnnotationStatistics,
  ] = useState({});
  const [relKappa, setRelKappa] = useState({});

  /* useEffects */
  useEffect(() => {
    //set project's annotators array
    getUsersByProject();
  }, []);

  useEffect(() => {
    // get statistics: {user:{statistics}}
    getUsersTagsAnnotationStatistics();
    getUsersRelationsAnnotationStatistics();
  }, [annotators]);

  useEffect(() => {
    //calc kappa for each label
    calcKappaForLabels();
  }, [UsersTagsAnnotationStatistics]);

  useEffect(() => {
    //calc kappa for each label
    calcKappaForRelations();
  }, [UsersRelationsAnnotationStatistics]);

  /* General */
  function getUsersByProject() {
    // get all annotators in project
    fetch("/api/users/users-by-project/?project=" + project_id)
      .then((response) => response.json())
      .then((data) => {
        // get users annotation
        setAnnotators(data.map((obj) => obj.username));
      });
  }

  //TODO: remove function after algorithm is ready.
  function formatAlgorithmOutput(outputObj) {
    let outputStr = "Algorithm Output: \n";
    for (let key in outputObj) {
      let pair = key
        .replace(/[()]/g, "")
        .split(",")
        .map((x) => x.trim());
      outputStr += `"${pair[0]}"<-->"${pair[1]}" : ${outputObj[key]} \n`;
    }
    return outputStr;
  }

  const sendProjectToAlgorithm = () => {
    //TODO: add loading to button
    // send data to algorithm
    fetch("/api/project/send-to-algorithm", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        project_id: project_id,
        tags: tagsForAlgorithm,
        relations: relationsForAlgorithm,
      }),
    })
      // Adding the new file to the project
      .then((response) => response.json())
      .then((data) => {
        // navigate to output page with projectId
        console.log(data);
        alert(formatAlgorithmOutput(data));
      });
  };

  const getAlgorithmInputPreview = () => {
    let str = "";
    str += "Tags: ";
    str += tagsForAlgorithm.join(" , ");
    str += "     "; //TODO: remove
    str += "\nRelations: ";
    str += relationsForAlgorithm.join(" , ");
    return str;
  };

  /* Tags */

  function processUserTagAnnotation(input) {
    let output = {};
    for (let i = 0; i < input.length; i++) {
      let objArr = input[i];
      let objMap = {};
      for (let j = 0; j < objArr.length; j++) {
        let obj = objArr[j];
        if (!objMap.hasOwnProperty(obj.tag)) {
          objMap[obj.tag] = [];
        }
        objMap[obj.tag].push([obj.start, obj.end]);
      }
      output[i] = objMap;
    }
    return output;
  }

  function calcKappaForLabels() {
    //TODO: add the correct calculation for kappa
    let tagCounts = {};
    let numObjects = Object.keys(UsersTagsAnnotationStatistics).length;

    for (let key in UsersTagsAnnotationStatistics) {
      let obj = UsersTagsAnnotationStatistics[key];
      for (let objKey in obj) {
        let tagObj = obj[objKey];
        for (let tagKey in tagObj) {
          let tagVal = tagObj[tagKey];
          if (!tagCounts[tagKey]) {
            tagCounts[tagKey] = 0;
          }
          tagCounts[tagKey] += tagVal.length / numObjects;
        }
      }
    }

    setTagKappa(tagCounts);
  }

  function getUsersTagsAnnotationStatistics() {
    for (const u in annotators) {
      //get user annotations
      fetch(
        "/api/project/get-annotation-of-tagger?project_id=" +
          project_id +
          "&tagger=" +
          annotators[u]
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((data) => {
          if (data != undefined) {
            return processUserTagAnnotation(data.tags);
          }
        })
        .then((data) => {
          setUsersTagsAnnotationStatistics({
            ...UsersTagsAnnotationStatistics,
            [annotators[u]]: data,
          });
        });
    }
  }

  /* Relations */
  function processUserRelationAnnotation(inp) {
    const indexDict = {};

    for (let i = 0; i < inp.length; i++) {
      const { tag, From, To } = inp[i];
      const { index: fromIndex } = From;
      const { index: toIndex } = To;

      if (!indexDict.hasOwnProperty(fromIndex)) {
        indexDict[fromIndex] = {};
      }
      if (!indexDict.hasOwnProperty(toIndex)) {
        indexDict[toIndex] = {};
      }

      if (!indexDict[fromIndex].hasOwnProperty(tag)) {
        indexDict[fromIndex][tag] = [];
      }
      if (!indexDict[toIndex].hasOwnProperty(tag)) {
        indexDict[toIndex][tag] = [];
      }

      indexDict[fromIndex][tag].push([
        [From.start, From.end],
        [To.start, To.end],
      ]);
      if (fromIndex !== toIndex) {
        indexDict[toIndex][tag].push([
          [From.start, From.end],
          [To.start, To.end],
        ]);
      }
    }

    return indexDict;
  }

  function getUsersRelationsAnnotationStatistics() {
    console.log("annotators ", annotators);
    for (const u in annotators) {
      //get user annotations
      fetch(
        "/api/project/get-annotation-of-tagger?project_id=" +
          project_id +
          "&tagger=" +
          annotators[u]
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          }
        })
        .then((data) => {
          if (data != undefined) {
            return processUserRelationAnnotation(data.relations);
          }
        })
        .then((data) => {
          setUsersRelationsAnnotationStatistics(
            (UsersRelationsAnnotationStatistics) => ({
              ...UsersRelationsAnnotationStatistics,
              [annotators[u]]: data,
            })
          );
        });
    }
  }

  function calcKappaForRelations() {
    const relCounts = {};
    let totalCount = 0;
    // count occurrences of each relationship type
    for (const key in UsersRelationsAnnotationStatistics) {
      const innerObj = UsersRelationsAnnotationStatistics[key];
      for (const innerKey in innerObj) {
        for (const rel in innerObj[innerKey]) {
          const relType = rel;
          if (!relCounts[relType]) {
            relCounts[relType] = 0;
          }
          relCounts[relType]++;
          totalCount++;
        }
      }
    }

    // calculate average of relationship type occurrences
    const avgRelCounts = {};
    for (const relType in relCounts) {
      if (relType !== "undefined") {
        avgRelCounts[relType] = relCounts[relType] / totalCount;
      }
    }

    setRelKappa(avgRelCounts);
  }

  /* Return */
  return (
    <div style={{ marginTop: "15px" }}>
      <h5>Tags</h5>
      <div>
        {Object.keys(tagKappa).length > 0 && (
          <ProjectTagTable
            data={tagKappa}
            threshold={0}
            setTagsForAlgorithm={setTagsForAlgorithm}
          />
        )}
      </div>
      <h5>Relations</h5>
      <div>
        {Object.keys(relKappa).length > 0 && (
          <ProjectRelationTable
            data={relKappa}
            threshold={0}
            setRelationsForAlgorithm={setRelationsForAlgorithm}
          />
        )}
      </div>
      <h5>Algorithm Input Preview</h5>
      <div>
        <input
          id="Algorithm_Input_Preview"
          class="Algorithm_Input_Preview"
          type="text"
          placeholder={getAlgorithmInputPreview()}
          disabled="true"
          style={{ width: "30%", height: "200px" }}
        />
      </div>

      <div>
        <button
          type="button"
          class="btn btn-secondary"
          onClick={() => sendProjectToAlgorithm()}
          style={{ marginTop: "25px" }}
        >
          Send Data to Algorithm
        </button>
      </div>
    </div>
  );
}
