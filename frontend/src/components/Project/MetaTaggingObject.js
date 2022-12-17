import React from "react";

export default function MetaTaggingObject(props) {
  console.log(props);
  return (
    <div>
      {props.metaTagging &&
        props.metaTagging.map((element, index) => (
          <li class="list-group-item">
            <span key={index}>
              <i
                class="bi bi-square-fill"
                style={{
                  color: element.color,
                  fontSize: "17px",
                  marginRight: "10px",
                }}
              ></i>
              <span>
                <b> label name: </b>
              </span>
              <span>{String(element.name)} </span>
              <span style={{ marginLeft: "10px" }}>
                <b> label type: </b>
              </span>
              <span>{String(element.type)} </span>
            </span>
          </li>
        ))}
    </div>
  );
}
