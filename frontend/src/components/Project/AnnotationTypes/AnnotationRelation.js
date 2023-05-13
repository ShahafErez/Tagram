import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationRelation(props) {
  const file = props.file;
  let TAG_COLORS = {};
  let tag_options = [];
  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  const [tag, setTag] = useState(tag_options[0]); // The current tag the user choose
  const [tagSelectingError, setTagSelectingError] = useState(""); // error content

  const [currentState, setCurrentState] = useState(props.relationCurrentState); // The current values being selected
  const [relationSummary, setRelationSummary] = useState(props.relationSummary); // The saved relations. Will be saved in db

  // the first and second element that were selected
  const [firstElement, setFirstElement] = useState({
    selected: false,
    start: null,
    end: null,
    tokens: [],
  });
  const [secondElement, setSecondElement] = useState({
    selected: false,
    start: null,
    end: null,
    tokens: [],
  });

  // tokens were selected
  function handleValueChange(key, selectedValue) {
    // saving the current state after relation selection
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    // setting the value at the first/second value
    let value = selectedValue[selectedValue.length - 1];
    if (!firstElement.selected) {
      setFirstElement({
        selected: true,
        start: value.start,
        end: value.end,
        tokens: value.tokens,
        index: key,
      });
    } else if (!secondElement.selected) {
      setSecondElement({
        selected: true,
        start: value.start,
        end: value.end,
        tokens: value.tokens,
        index: key,
      });
    }
    // sending the updated variables to project page
    props.onChangeRelation(relationSummary, temp_current_state);
  }

  function handleSave() {
    // saving the relation in relationSummary
    let temp_relation_summary = JSON.parse(JSON.stringify(relationSummary));

    // change tokens to lowercase and remove punctuation symbols
    let newTokensFirstElement = [];
    firstElement.tokens.map((token) => {
      newTokensFirstElement.push(
        token.toLowerCase().replace(/[^a-zA-Z ]/g, "")
      );
    });
    firstElement["tokens"] = newTokensFirstElement;

    let newTokensSecondElement = [];
    secondElement.tokens.map((token) => {
      newTokensSecondElement.push(
        token.toLowerCase().replace(/[^a-zA-Z ]/g, "")
      );
    });
    secondElement["tokens"] = newTokensSecondElement;

    temp_relation_summary.push({
      tag: tag,
      From: firstElement,
      To: secondElement,
    });
    setRelationSummary(temp_relation_summary);
    // re-setting the current state to be null and the first and second values
    let new_current_state = new Array(file.length).fill([]);
    setCurrentState(new_current_state);
    setFirstElement({
      selected: false,
      start: null,
      end: null,
      tokens: [],
    });
    setSecondElement({
      selected: false,
      start: null,
      end: null,
      tokens: [],
    });
    props.onChangeRelation(temp_relation_summary, new_current_state);
  }

  // the selected tag was changed
  function handleTagChange(e) {
    // checking if the current state isn't in the middle of a tag change
    if (!firstElement.selected && !secondElement.selected) {
      setTag(e.target.value);
      if (tagSelectingError !== "") {
        setTagSelectingError("");
      }
    } else {
      // showing an alert message
      setTagSelectingError(
        <div
          style={{ marginTop: "5px" }}
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          You can't change relation type during selection
          <button
            style={{ marginTop: "0px" }}
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setTagSelectingError("");
            }}
          ></button>
        </div>
      );
    }
  }

  // re-setting the current state
  function handleResetSelect() {
    setFirstElement({
      selected: false,
      start: null,
      end: null,
      tokens: [],
    });
    setSecondElement({
      selected: false,
      start: null,
      end: null,
      tokens: [],
    });
    let new_current_state = new Array(file.length).fill([]);
    setCurrentState(new_current_state);
    props.onChangeRelation(relationSummary, new_current_state);
  }

  function processToken(value) {
    let tokenString = "";
    value.tokens.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  }

  function removeSelection(key) {
    let temp_relation_summary = JSON.parse(JSON.stringify(relationSummary));
    temp_relation_summary.splice(key, 1);
    setRelationSummary(temp_relation_summary);
    props.onChangeRelation(temp_relation_summary, currentState);
  }

  return (
    <div class="annotate">
      <div style={{ padding: "10px" }}>
        <h4>Annotate Relations</h4>

        <div class="container">
          <div class="row">
            <div class="col-md-8">
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

              <div>{tagSelectingError}</div>
              {/* Each line of the file has a TokenAnnotator tag */}
              <div
                class="border border-secondary rounded"
                style={{ marginTop: "10px" }}
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
                          // checking if value was removed or is both terms wasn't selected yet
                          if (
                            e.length < currentState[key].length ||
                            (firstElement.selected && secondElement.selected)
                          ) {
                            return "";
                          }
                          handleValueChange(key, e);
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
                onClick={handleResetSelect}
              >
                Clear
              </button>

              <button
                class="btn btn-secondary"
                onClick={() => {
                  if (firstElement.selected && secondElement.selected) {
                    handleSave();
                  }
                }}
              >
                Save Relation
              </button>
            </div>

            <div class="col-6 col-md-4">
              <h4>Selected Relations</h4>
              <div style={{ width: "80%", margin: "auto" }}>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Type</th>
                      <th scope="col">Term From</th>
                      <th scope="col">Term To</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {relationSummary.length > 0 &&
                      relationSummary.map((val, key) => {
                        return (
                          <tr key={key}>
                            <td>{val.tag}</td>
                            <td>{processToken(val.From)}</td>
                            <td>{processToken(val.To)}</td>
                            <td>
                              <i
                                class="bi bi-trash3"
                                style={{ cursor: "pointer" }}
                                onClick={() => removeSelection(key)}
                              ></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
