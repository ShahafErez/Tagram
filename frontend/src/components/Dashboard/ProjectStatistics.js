import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import "../../../static/css/ProjectStatistics.css";
import Badge from "react-bootstrap/Badge";
import ProjectRelationsTable from "./ProjectRelationsTable";

export default function ProjectStatistics({ data }) {
  const [relArray, setRelArray] = useState([]);
  const [allTags, setAllTags] = useState({});
  const [allRelations, setAllRelations] = useState({});
  const [allCoOccurrence, setAllCoOccurence] = useState({});
  const [inputForAlgorithm, setInputForAlgorithm] = useState("");

  useEffect(() => {
    let tempRelArray = [];
    for (const item of data) {
      for (const rel of item.relations) {
        //   setRelArray([...relArray, rel]);
        tempRelArray.push(rel);
      }
    }
    setRelArray(tempRelArray);
  }, []);
  //TODO: after projects will be save by user, add "User consent range" to each label (chen)

  /* ****************************** General ****************************** */
  const project_id = data.length > 0 ? data[0].project_id : null;

  function AccordionItem({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="accordion-item">
        <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
          {title}
        </div>
        {isOpen && <div className="accordion-content">{children}</div>}
      </div>
    );
  }

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
    return getAllTags();
  };

  const checkChange = (category, index, title) => {
    if (category === "Tags") {
      let checkBox = document.getElementById(getCheckboxIndex(category, index));
      console.log(checkBox.id, checkBox.checked, title, checkBox.value);
      //TODO: bug when checking something new
      if (checkBox.checked == true) {
        checkBox.checked = true;
        // add to allTags
        addToAllTags(title, checkBox.value);
      } else {
        // remove from allTags
        checkBox.checked = false;
        removeFromAllTags(title, checkBox.value);
      }
    }
  };

  const getCheckboxIndex = (category, index) => {
    if (category === "Tags") {
      return `${category}_${index}`;
    }
  };

  const aboveThreshold = (token_, category, tag_, thres) => {
    // TODO: change to be by user
    // TODO: check threshold

    // add to arrays
    if (category === "Tags") {
      let val = allTags[tag_];
      if (val) {
        if (!val.has(token_)) {
          const temp = val.add(token_);
          setAllTags({ ...allTags, [tag_]: temp });
        }
      } else {
        const newSet = new Set();
        newSet.add(token_);
        setAllTags({ ...allTags, [tag_]: newSet });
      }
    }
    return true;
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

  function getAllTags() {
    return Object.keys(allTags)
      .map((key) => `${key}:${JSON.stringify(Array.from(allTags[key]))}`)
      .join(", ");
  }

  // const accordionItems = Array.from(tagMap.values()).map((tagObj) => (
  //   <AccordionItem key={tagObj.tag} title={tagObj.tag}>
  //     <ul>
  //       {tagObj.tokens.map((token, index) => (
  //         <li key={index}>{token}</li>
  //       ))}
  //     </ul>
  //   </AccordionItem>
  // ));

  const getTotalTagsByLabel = (tag, token) => {
    const val = tagMap.get(tag).tokens;
    // console.log("val is: "+val);
    if (val) {
      return val.filter((x) => x == token).length;
    }
    return 0;
  };

  const addToAllTags = (title, value) => {
    let val = allTags[title];
    if (val && val.size > 0) {
      if (!val.has(value)) {
        const temp = val.add(value);
        setAllTags({ ...allTags, [title]: temp });
      }
    } else {
      const newSet = new Set();
      newSet.add(value);
      setAllTags({ ...allTags, [title]: newSet });
    }
  };

  const removeFromAllTags = (title, value) => {
    let val = allTags[title];
    if (val) {
      if (val.has(value)) {
        const temp = val.delete(value);
        setAllTags({ ...allTags, [title]: temp });
      }
    }
  };

  const accordionItemsTags = Array.from(tagMap.values()).map((tagObj) => {
    // Create a new set of unique tokens
    const uniqueTokens = [...new Set(tagObj.tokens)];

    return (
      <AccordionItem key={tagObj.tag} title={tagObj.tag}>
        <ul>
          {uniqueTokens.map((token, index) => (
            <li key={index}>
              {/* {token}  */}
              {/* <Badge bg="primary" pill>
                {getTotalTagsByLabel(tagObj.tag,token)}
              </Badge> */}
              <input
                class="form-check-input"
                type="checkbox"
                value={token}
                id={getCheckboxIndex("Tags", index)}
                // checked={aboveThreshold(token, "Tags", tagObj.tag, 0.6)}
                onClick={() => {
                  checkChange("Tags", index, tagObj.tag);
                }}
              />
              <label
                class="form-check-label"
                for={getCheckboxIndex("Tags", index)}
              >
                {token}
              </label>
              <Badge bg="primary" pill>
                {getTotalTagsByLabel(tagObj.tag, token)}
              </Badge>
            </li>
          ))}
        </ul>
      </AccordionItem>
    );
  });

  /* ****************************** Relations ****************************** */

  //   let tempRelArray = [];
  //   for (const item of data) {
  //     for (const rel of item.relations) {
  //       //   setRelArray([...relArray, rel]);
  //       tempRelArray.push(rel);
  //     }
  //   }
  //   setRelArray(tempRelArray);

  return (
    <div style={{ margintTop: "5px", marginBottom: "20px" }}>
      <br></br>
      <hr class="hr" />
      <br></br>
      <h2>Annotation Information about Project {project_id}</h2> <br></br>
      <h2>Tags</h2>
      <Accordion>{accordionItemsTags}</Accordion>
      <br></br>
      <h2>Relations</h2>
      <ProjectRelationsTable data={relArray} />
      <br></br>
      <h2>TODO: Co-Occcurrence</h2>
      <br></br>
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
