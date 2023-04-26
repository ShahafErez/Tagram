import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";
import { ReactSession } from "react-client-session";

export default function AnnotationTag(props) {
  // mapping the selected tags and tag colors
  let TAG_COLORS = {};
  let tag_options = [];
  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  const file = props.file;

  const [currentState, setCurrentState] = useState(props.tagCurrentState); // a matrix, each story is in array, representing the values currenly selected
  const [tagsSummary, setTagsSummary] = useState(props.tagSummary); // an array, all values that were selected and saved
  const [tag, setTag] = useState(tag_options[0]); // tag- currently selected tag
  let tagSessionField = props.tagSessionField; // string representing the value of the field to be saved in react session

  // tokens were selected
  function handleValueChange(key, selectedValue) {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);
    props.onChangeTags(tagsSummary, temp_current_state);
    ReactSession.set(tagSessionField, temp_current_state);
  }

  // tokens were un-selected
  function unselectValue(key, selectedValue) {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);
    props.onChangeTags(tagsSummary, temp_current_state);
  }

  // the selected tag was changed
  function handleTagChange(e) {
    setTag(e.target.value);
  }

  // saving all current tags
  function handleSave() {
    let temp_tags_summary = JSON.parse(JSON.stringify(tagsSummary));
    // change tokens to lowercase and remove punctuation symbols
    let currentStateProcessed = [];
    currentState.flat().map((selection) => {
      let newTokens = [];
      selection.tokens.map((token) => {
        newTokens.push(token.toLowerCase().replace(/[^a-zA-Z ]/g, ""));
      });
      selection["tokens"] = newTokens;
      currentStateProcessed.push(selection);
    });
    temp_tags_summary.push.apply(temp_tags_summary, currentStateProcessed);

    setTagsSummary(temp_tags_summary);
    // resetting the current state to be empty
    let new_current_state = new Array(file.length).fill([]);
    setCurrentState(new_current_state);
    props.onChangeTags(temp_tags_summary, new_current_state);
  }

  // Removing tagging set
  function removeSet(key) {
    let temp_tags_summary = JSON.parse(JSON.stringify(tagsSummary));
    temp_tags_summary.splice(key, 1);
    setTagsSummary(temp_tags_summary);
    props.onChangeTags(temp_tags_summary, currentState);
  }

  // re-setting the current state
  function handleResetSelect() {
    let new_current_state = new Array(file.length).fill([]);
    setCurrentState(new_current_state);
    props.onChangeTags(tagsSummary, new_current_state);
  }

  function processToken(value) {
    let tokenString = "";
    value.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  }

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

          <button
            type="submit"
            class="btn btn-passive"
            style={{
              marginRight: "10px",
              backgroundColor: "#adb5bd",
            }}
            title="clear all selected tags"
            onClick={handleResetSelect}
          >
            Clear
          </button>
          <button
            class="btn btn-secondary"
            onClick={() => {
              handleSave();
            }}
          >
            Save Tags
          </button>

          <h4>Selected Tags</h4>
          <div style={{ width: "80%", margin: "auto" }}>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Term</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {tagsSummary.flat().map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.tag}</td>
                      <td>{processToken(val.tokens)}</td>
                      <td>
                        <i
                          class="bi bi-trash3"
                          style={{ cursor: "pointer" }}
                          onClick={() => removeSet(key)}
                        ></i>
                      </td>
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
