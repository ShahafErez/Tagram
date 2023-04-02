import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
// import Accordion from 'react-bootstrap/Accordion';
// import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import "../../../static/css/ProjectStatistics.css";
import Badge from 'react-bootstrap/Badge';

export default function ProjectStatistics({ data }) {

    const tagMap = new Map();
    for (const item of data) {
        // console.log(item);
      for (const tag of item.tags) {
        // console.log("---- tag ----");
        // console.log(tag);
        for (const i of tag) {
            // console.log(i);
            // const [tagObj] = i;
            const { tag: tagName, tokens } = i;
            // console.log(tagName);
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
      
    // const accordionItems = Array.from(tagMap.values()).map((tagObj) => (
    //   <AccordionItem key={tagObj.tag} title={tagObj.tag}>
    //     <ul>
    //       {tagObj.tokens.map((token, index) => (
    //         <li key={index}>{token}</li>
    //       ))}
    //     </ul>
    //   </AccordionItem>
    // ));

    const getTotalTagsByLabel = (tag,token) => {
        const val = tagMap.get(tag).tokens;
        // console.log("val is: "+val);
        if(val){
            return val.filter(x => x==token).length;
        }
        return 0;
        };
    const accordionItems = Array.from(tagMap.values()).map((tagObj) => {
        // console.log("tagMap:");
        // console.log(tagMap);
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
                          id="flexCheckDefault"
                          checked="true"
                        />
                        <label class="form-check-label" for="flexCheckDefault">
                        {token}
                        </label>
                        <Badge bg="primary" pill>
                {getTotalTagsByLabel(tagObj.tag,token)}
              </Badge>
              </li>
              ))}
            </ul>
          </AccordionItem>
        );
      });
  
    return (
        <div style={{ margintTop: "5px", marginBottom: "20px" }}>
            <h2>Tags</h2>
<Accordion >{accordionItems}</Accordion>
<h2>TODO: Relations</h2>
<h2>TODO: Co-Occcurrence</h2>
        </div>
    );
}

