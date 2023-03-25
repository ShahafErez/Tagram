import React from "react";

export default function CorrectnessPage(props) {
  // let file = props.file;

  // let file =
  //   "As a project manager I want to be able to add projects\n" +
  //   "As a user I want to be able to save my username\n" +
  //   "As a manager I want to be able to add users to projects\n" +
  //   "As a user I want to be able to save my username";

  // let textArray = [];
  // file.split("\n").map((element, index) => {
  //   textArray.push(element.trim());
  // });

  let textArray = [
    "As a project manager I want to be able to add projects As a project manager I want to be able to add projects As a project manager I want to be able to add projects As a project manager I want to be able to add projects As a project manager I want to be able to add projects As a project manager I want to be able to add projects As a project manager I want to be able to add projects As a project manager I want to be able to add projects",
    "As a user I want to be able to save my username",
    "As a manager I wantf to be able to add users to projects",
    "As a user I want to be able to save my username",
  ];

  let duplicatesArray = new Set();

  textArray.map((element, index) => {
    if (textArray.indexOf(element) !== index) {
      duplicatesArray.add(index);
      duplicatesArray.add(textArray.indexOf(element));
    }
  });

  return (
    <div class="form-group">
      {textArray.map((element, index) => (
        <div>
          <textarea
            spellCheck="true"
            class="form-control"
            id="exampleFormControlTextarea1"
          >
            {element}
          </textarea>
          {duplicatesArray.has(index) ? <div>DUPLICATE</div> : <div></div>}
        </div>
      ))}
    </div>
  );
}
