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

  /**
   * To support multi-lines files, we set the below variable to be an array
   * the size of the array will be the number of lines in the file
   */
  const [currentState, setCurrentState] = useState(props.tagCurrentState);
  const file = props.file;
  const [tagsSummary, setTagsSummary] = useState(props.tagsSummary);

  const [tag, setTag] = useState(tag_options[0]);

  /**
   * Updating the current state and the tags summary arrays with the updated information
   * @param {*} key the line's index in the file
   * @param {*} selectedValue the updated value
   */
  const handleValueChange = (key, selectedValue) => {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    let temp_tags_summary = JSON.parse(JSON.stringify(tagsSummary));
    let tagObject = createTagObject(selectedValue[selectedValue.length - 1]);
    temp_tags_summary[key].push(tagObject);
    setTagsSummary(temp_tags_summary);

    // sending the updated arrays to the parent component
    props.onChangeTags(temp_tags_summary, temp_current_state);
  };

  /**
   * Unselecting a value- updating the current state
   * And re-setting all the values in tags summary
   */
  const unselectValue = (key, selectedValue) => {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    let temp_tags_summary = JSON.parse(JSON.stringify(tagsSummary));
    for (let i = 0; i < temp_tags_summary.length; i++) {
      temp_tags_summary[i] = temp_current_state[i];
    }
    setTagsSummary(temp_tags_summary);

    props.onChangeTags(temp_tags_summary, temp_current_state);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  /** Creating a json object that will store the value of the selected tag */
  function createTagObject(value) {
    return {
      Type: tag,
      tokens: value.tokens,
      start: value.start,
      end: value.end,
      tag: value.tag,
      color: value.color,
    };
  }

  const processToken = (value) => {
    let tokenString = "";
    value.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  };

  return (
    <div class="annotate">
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
              {tagsSummary.flat(1).map((val, key) => {
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
    </div>
  );
}
