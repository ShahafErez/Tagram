import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import "../../../static/css/ProjectStatistics.css";
import Badge from "react-bootstrap/Badge";
import ProjectRelationsTable from "./ProjectRelationsTable";
import ProjectTagsTable from "./ProjectTagsTable";
import ProjectTagsTable2 from "./ProjectTagsTable2";

export default function ProjectStatistics2({ project_id }) {
  console.log("--- in ProjectStatistics2---");
  const [annotators, setAnnotators] = useState([]);
  const [UsersAnnotationStatistics, setUsersAnnotationStatistics] = useState(
    {}
  );
  const [tagKappa, setTagKappa] = useState({});

  useEffect(() => {
    //set project's annotators array
    getUsersByProject();
  }, []);

  useEffect(() => {
    // get statistics: {user:{statistics}}
    getUsersAnnotationStatistics();
  }, [annotators]);

  useEffect(() => {
    //calc kappa for each label
    calcKappaForLabels();
  }, [UsersAnnotationStatistics]);

  /* ****************************** General ****************************** */

  const sendProjectToAlgorithm = () => {
    //TODO: add loading to button
    // send data to algorithm
    fetch("/api/project/get-algorithm-output?project_id=" + project_id)
      .then((response) => response.json())
      .then((data) => {
        // navigate to output page with project_id
      });
  };

  /* ****************************** Tags ****************************** */

  //   const tagMap = new Map();
  //   for (const item of data) {
  //     for (const tag of item.tags) {
  //       for (const i of tag) {
  //         const { tag: tagName, tokens } = i;
  //         const existingTag = tagMap.get(tagName);
  //         if (existingTag) {
  //           existingTag.tokens.push(...tokens);
  //           //   existingTag.tokens = [...new Set(existingTag.tokens)];
  //         } else {
  //           tagMap.set(tagName, { tag: tagName, tokens: [...tokens] });
  //         }
  //       }
  //     }
  //   }

  function processUserAnnotation(input) {
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
    let tagCounts = {};
    let numObjects = Object.keys(UsersAnnotationStatistics).length;

    for (let key in UsersAnnotationStatistics) {
      let obj = UsersAnnotationStatistics[key];
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

  function getUsersAnnotationStatistics() {
    for (const u in annotators) {
      //get user annotations
      fetch(
        "/api/project/get-annotation-of-tagger?project_id=" +
          project_id +
          "&tagger=" +
          annotators[u]
      )
        .then((response) => response.json())
        .then((data) => {
          return processUserAnnotation(data.tags);
        })
        .then((data) => {
          setUsersAnnotationStatistics({
            ...UsersAnnotationStatistics,
            [annotators[u]]: data,
          });
        });
    }
  }

  function getUsersByProject() {
    // get all annotators in project
    fetch("/api/users/users-by-project/?project=" + project_id)
      .then((response) => response.json())
      .then((data) => {
        // get users annotation
        setAnnotators(data.map((obj) => obj.username));
      });
  }

  /* ****************************** Relations ****************************** */

  /* ****************************** Return ****************************** */
  return (
    <div class="grid-container">
      <br></br>
      <hr class="hr" />
      <br></br>
      <h2>Annotation Information about Project {project_id}</h2> <br></br>
      <h2>Tags</h2>
      <div>
        {Object.keys(tagKappa).length > 0 && (
          <ProjectTagsTable2 data={tagKappa} threshold={3} />
        )}
      </div>
      <h2>Relations</h2>
      <div></div>
      <div>
        <h2>TODO: Co-Occcurrence</h2>
      </div>
    </div>
  );
}
