import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationTag(props) {
  let TAG_COLORS = {};
  let tag_options = [];

  // mapping the values for the token information
  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  // The selected values are represented by a matrix, each story is in array
  const [currentState, setCurrentState] = useState(props.tagCurrentState);
  const file = props.file;
  const [tag, setTag] = useState(tag_options[0]);

  const handleValueChange = (key, selectedValue) => {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);
    props.onChangeTags(temp_current_state);
  };

  const unselectValue = (key, selectedValue) => {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);
    props.onChangeTags(temp_current_state);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const processToken = (value) => {
    let tokenString = "";
    value.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  };

  return (
    <div class="annotate">
      {currentState && (
        <div style={{ padding: "10px" }}>
          <h4>Annotate Tags</h4>
          <div>
            <select
              class="form-select"
              size="2"
              aria-label="multiple select example"
              onChange={handleTagChange}
              value={tag}
            >
              {tag_options.map((element, index) => (
                <option key={index}>{element}</option>
              ))}
            </select>
          </div>

          {/* Each line of the file has a TokenAnnotator tag */}
          <div
            class="border border-secondary rounded"
            style={{ marginTop: "15px" }}
          >
            <div class="text">
              {file.map((sentence, key) => {
                return (
                  <TokenAnnotator
                    style={{
                      padding: "5px",
                      lineHeight: 1.5,
                    }}
                    tokens={sentence.split(" ")}
                    value={currentState[key]}
                    onChange={(e) => {
                      // checking if a value was un-selected
                      if (e.length < currentState[key].length) {
                        unselectValue(key, e);
                      } else {
                        // new value was added
                        handleValueChange(key, e);
                      }
                    }}
                    getSpan={(span) => ({
                      ...span,
                      tag: tag,
                      color: TAG_COLORS[tag],
                    })}
                  />
                );
              })}
            </div>
          </div>

          <h4>Selected Tags</h4>
          <div style={{ width: "80%", margin: "auto" }}>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Term</th>
                </tr>
              </thead>
              <tbody>
                {currentState.flat().map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.tag}</td>
                      <td>{processToken(val.tokens)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
