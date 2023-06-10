import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Kappa from "./Kappa";
import ProjectRelationTable from "./ProjectRelationTable";
import ProjectTagTable from "./ProjectTagTable";

export default function ProjectStatistics(props) {
  let project_id = props.project_id;

  const [annotators, setAnnotators] = useState([]);
  const [tagsForAlgorithm, setTagsForAlgorithm] = useState([]);
  const [relationsForAlgorithm, setRelationsForAlgorithm] = useState([]);
  const [allAnnotationData, setallAnnotationData] = useState([]);

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
    getAllAnnotationData();
  }, [annotators]);

  useEffect(() => {
    // get statistics: {user:{statistics}}
    getUsersTagsAnnotationStatistics();
    getUsersRelationsAnnotationStatistics();
  }, [allAnnotationData]);

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

  function getAllAnnotationData() {
    fetch("/api/project/get-annotation-of-project?project_id=" + project_id)
      .then((response) => response.json())
      .then((data) => {
        setallAnnotationData(data);
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
        alert(formatAlgorithmOutput(data));
      });
  };

  const getAlgorithmInputPreview = () => {
    let tags_str = "";
    tags_str += "Tags: ";
    tags_str += tagsForAlgorithm.join(" , ");
    let rel_str = "";
    rel_str += "Relations: ";
    rel_str += relationsForAlgorithm.join(" , ");
    let str = [tags_str, rel_str].join("\n");
    return str;
  };

  /* Tags */

  function processUserTagAnnotation(input) {
    const output = input.reduce((result, value, index) => {
      const tag = value.tag;
      const start = value.start;
      const end = value.end;

      if (!result[index]) {
        result[index] = {};
      }

      result[index][tag] = [start, end];

      return result;
    }, {});

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
          tagCounts[tagKey] += Math.ceil(tagVal.length / numObjects);
        }
      }
    }

    setTagKappa(tagCounts);
  }

  function getUsersTagsAnnotationStatistics() {
    let results = [];

    for (const u in annotators) {
      const userTags = allAnnotationData.filter(
        (x) => x.tagger === annotators[u]
      );
      if (userTags.length > 0) {
        let result_processUserTagAnnotation = processUserTagAnnotation(
          userTags[0].tags
        );
        results.push({
          user: annotators[u],
          data: result_processUserTagAnnotation,
        });
      }
    }

    let temp_UsersTagsAnnotationStatistics = {};
    for (const r in results) {
      if (results[r] !== undefined) {
        temp_UsersTagsAnnotationStatistics[results[r].user] = results[r].data;
      }
    }
    setUsersTagsAnnotationStatistics(temp_UsersTagsAnnotationStatistics);
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
    let results = [];

    for (const u in annotators) {
      const userRels = allAnnotationData.filter(
        (x) => x.tagger === annotators[u]
      );
      if (userRels.length > 0) {
        let result_processUserRelationAnnotation =
          processUserRelationAnnotation(userRels[0].relations);
        results.push({
          user: annotators[u],
          data: result_processUserRelationAnnotation,
        });

        let temp_UsersRelationsAnnotationStatistics = {};

        for (const r in results) {
          temp_UsersRelationsAnnotationStatistics[results[r].user] =
            results[r].data;
        }

        setUsersRelationsAnnotationStatistics(
          temp_UsersRelationsAnnotationStatistics
        );
      }
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
      {annotators.length < 2 && (
        <div>
          <Alert variant={"danger"}>
            <Alert.Heading>Not enough data</Alert.Heading>
            <hr />
            Not enough annotators annotate this project.
          </Alert>
        </div>
      )}
      {annotators.length > 1 && (
        <div>
          <Alert variant={"info"}>
            <Alert.Heading>Fleiss Kappa Score For Labels</Alert.Heading>
            <hr />
            <h2>
              <Badge bg="light" text="dark">
                {" "}
                {Object.keys(UsersTagsAnnotationStatistics).length > 0 && (
                  <Kappa
                    data={UsersTagsAnnotationStatistics}
                    calcFor={"tags"}
                  />
                )}
              </Badge>
            </h2>
          </Alert>
          <Alert variant={"info"}>
            <Alert.Heading>Fleiss Kappa Score For Relations</Alert.Heading>
            <hr />
            <h2>
              <Badge bg="light" text="dark">
                {" "}
                {Object.keys(UsersRelationsAnnotationStatistics).length > 0 && (
                  <Kappa
                    data={UsersRelationsAnnotationStatistics}
                    calcFor={"relations"}
                  />
                )}
              </Badge>
            </h2>
          </Alert>

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
            <Form>
              <Form.Group className="mb-3" controlId="Algorithm_Input_Preview">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={getAlgorithmInputPreview()}
                  disabled="true"
                />
              </Form.Group>
            </Form>
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
      )}
    </div>
  );
}
