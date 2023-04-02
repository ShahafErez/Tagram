import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import "../../../static/css/ProjectStatistics.css";
import Badge from "react-bootstrap/Badge";

export default function ProjectStatistics({ data }) {
  const [allTags, setAllTags] = useState({});
  const [allRelations, setAllRelations] = useState({});
  const [allCoOccurrence, setAllCoOccurence] = useState({});
  //TODO: after projects will be save by user, add "User consent range" to each label (chen)
  const project_id = data.length > 0 ? data[0].project_id : null;
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

  function getAllTags() {
    return Object.keys(allTags)
      .map((key) => `${key}:${JSON.stringify(Array.from(allTags[key]))}`)
      .join(", ");
  }

  const getAlgorithmInputPreview = () => {
    return getAllTags();
  };

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

  const accordionItems = Array.from(tagMap.values()).map((tagObj) => {
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
                value=""
                id={index}
                checked={aboveThreshold(token, "Tags", tagObj.tag, 0.6)}
              />
              <label class="form-check-label" for={index}>
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

  return (
    <div style={{ margintTop: "5px", marginBottom: "20px" }}>
      <br></br>
      <hr class="hr" />
      <br></br>
      <h2>Annotation Information about Project {project_id}</h2> <br></br>
      <h2>Tags</h2>
      <Accordion>{accordionItems}</Accordion>
      <br></br>
      <h2>TODO: Relations</h2>
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
