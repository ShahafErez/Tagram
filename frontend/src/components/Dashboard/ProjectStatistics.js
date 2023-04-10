import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import "../../../static/css/ProjectStatistics.css";
import Badge from "react-bootstrap/Badge";
import ProjectRelationsTable from "./ProjectRelationsTable";
import ProjectTagsTable from "./ProjectTagsTable";

export default function ProjectStatistics({ data }) {
  console.log(data);
  const [relArray, setRelArray] = useState([]);
  const [tagsArray, settagsArray] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allRelations, setAllRelations] = useState([]);
  const [allCoOccurrence, setAllCoOccurence] = useState({});
  const [inputForAlgorithm, setInputForAlgorithm] = useState("");
  const [newtagmap, setnewtagmap] = useState(new Map());

  const updateTagsPreview = (newTags) => {
    setAllTags(newTags);
  };

  const updateRelationsPreview = (newRelations) => {
    console.log(newRelations);
    setAllRelations(newRelations);
  };
  useEffect(() => {
    let tempRelArray = [];
    for (const item of data) {
      for (const rel of item.relations) {
        //   setRelArray([...relArray, rel]);
        tempRelArray.push(rel);
      }
    }
    setRelArray(tempRelArray);
    let tempTagsArray = [];
    for (const item of data) {
      for (const tag of item.tags) {
        //   setRelArray([...relArray, rel]);
        tempTagsArray.push(tag);
      }
    }
    settagsArray(tempTagsArray);
    getTagMap();
  }, []);

  /* ****************************** General ****************************** */
  const project_id = data.length > 0 ? data[0].project_id : null;

  const sendProjectToAlgorithm = () => {
    //TODO: add loading to button
    // send data to algorithm
    fetch("/api/project/get-algorithm-output?project_id=" + project_id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // navigate to output page with project_id
      });
  };

  const getAlgorithmInputPreview = () => {
    let str = "";
    str += "Tags: ";
    str += getAllTags();
    str += "     "; //TODO: remove
    str += "\nRelations: ";
    str += getAllRelations();
    return str;
  };

  /* ****************************** Tags ****************************** */

  const tagMap = new Map();
  for (const item of data) {
    for (const tag of item.tags) {
      for (const i of tag) {
        const { tag: tagName, tokens } = i;
        const existingTag = tagMap.get(tagName);
        if (existingTag) {
          existingTag.tokens.push(...tokens);
          //   existingTag.tokens = [...new Set(existingTag.tokens)];
        } else {
          tagMap.set(tagName, { tag: tagName, tokens: [...tokens] });
        }
      }
    }
  }

  const getUsersAnnotationStatistics = (users) => {
    console.log(tagMap);
    //get annotation for each user
  };

  const getTagMap = () => {
    // get all annotators in project
    fetch("/api/users/users-by-project/?project=" + project_id)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // get users annotation
        getUsersAnnotationStatistics(data.map((obj) => obj.user));
      })
      .then((data) => {
        console.log(data);
      });
  };

  function getAllTags() {
    return allTags.join(", ");
  }

  /* ****************************** Relations ****************************** */

  function getAllRelations() {
    return JSON.stringify(allRelations);
  }

  /* ****************************** Return ****************************** */
  return (
    <div class="grid-container">
      <br></br>
      <hr class="hr" />
      <br></br>
      <h2>Annotation Information about Project {project_id}</h2> <br></br>
      <h2>Tags</h2>
      {/* <Accordion>{accordionItemsTags}</Accordion> */}
      <div>
        <ProjectTagsTable data={tagMap} updateTagsPreview={updateTagsPreview} />
      </div>
      <h2>Relations</h2>
      <div>
        <ProjectRelationsTable
          data={relArray}
          updateRelationsPreview={updateRelationsPreview}
        />
      </div>
      <div>
        <h2>TODO: Co-Occcurrence</h2>
      </div>
      <div>
        <h4 style={{ margintTop: "5px", marginBottom: "20px" }}>
          Algorithm Input Preview
        </h4>
        <input
          id="Algorithm_Input_Preview"
          class="Algorithm_Input_Preview"
          type="text"
          placeholder={getAlgorithmInputPreview()}
          disabled="true"
        />
      </div>
      <br></br>
      <div class="container bg-light">
        <div class="col-md-12 text-center">
          <button
            type="button"
            class="btn btn-info"
            onClick={() => sendProjectToAlgorithm()}
          >
            Send Project {project_id} to Algorithm!
          </button>
        </div>
      </div>
    </div>
  );
}
