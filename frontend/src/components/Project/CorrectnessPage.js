import React from "react";

export default function CorrectnessPage(props) {
  let file =
    "As a project manager I want to be able to add projects\n" +
    "As a user I want to be able to save my username\n" +
    "As a manager I want to be able to add users to projects\n" +
    "As a user I want to be able to save my username";

  let textArray = file.split("\n");

  let duplicatesArray = new Set();

  textArray.map((element, index) => {
    if (textArray.indexOf(element) !== index) {
      duplicatesArray.add(index);
      duplicatesArray.add(textArray.indexOf(element));
    }
  });
  console.log("duplicatesArray ", duplicatesArray);

  console.log("file ", file);

  return (
    <div>
      <ol class="list-group" style={{ marginLeft: "25px" }}>
        {textArray.map((element, index) =>
          duplicatesArray.has(index) ? (
            // list item has duplication
            <li
              class="list-group-item-warning"
              style={{ paddingLeft: "5px", color: "black" }}
            >
              {textArray.in}
              {element}
            </li>
          ) : (
            // list item does not have duplication
            <li
              class="list-group-item-light"
              style={{ paddingLeft: "5px", color: "black" }}
            >
              {textArray.in}
              {element}
            </li>
          )
        )}
      </ol>
    </div>
  );
}
