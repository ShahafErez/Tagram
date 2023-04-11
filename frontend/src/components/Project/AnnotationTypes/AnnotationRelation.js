import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationRelation(props) {
  const file = props.file;
  let TAG_COLORS = {};
  let tag_options = [];

  // The current tag the user choose
  const [tag, setTag] = useState(tag_options[0]);
  const [tagSelectingError, setTagSelectingError] = useState("");

  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  /* The current values being selected. Displaying the select on text.
    Each line in file will be a separate array */
  const [currentState, setCurrentState] = useState(props.relationCurrentState);
  /* The saved relations. Will be saved in db
   * Saving all values in a single array */
  const [relationSummary, setRelationSummary] = useState(props.relationSummary);

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

  const handleValueChange = (key, selectedValue) => {
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
  };

  const handleSave = () => {
    // saving the relation in relationSummary
    let temp_relation_summary = JSON.parse(JSON.stringify(relationSummary));
    temp_relation_summary.push({
      tag: tag,
      From: firstElement,
      To: secondElement,
    });
    setRelationSummary(temp_relation_summary);
    // re-setting the current state to be null
    let now_current_state = new Array(file.length).fill([]);
    setCurrentState(now_current_state);
    props.onChangeRelation(temp_relation_summary, currentState);
    // re-setting the first and second values
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
    props.onChangeRelation(temp_relation_summary, now_current_state);
  };

  const handleTagChange = (e) => {
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
  };

  // re-setting the current state
  const handleResetSelect = () => {
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
    let now_current_state = new Array(file.length).fill([]);
    setCurrentState(now_current_state);
    props.onChangeRelation(relationSummary, now_current_state);
  };

  const processToken = (value) => {
    let tokenString = "";
    value.tokens.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  };

  const removeSelection = (key) => {
    let temp_relation_summary = JSON.parse(JSON.stringify(relationSummary));
    temp_relation_summary.splice(key, 1);
    setRelationSummary(temp_relation_summary);
    props.onChangeRelation(temp_relation_summary, currentState);
  };

  return (
    <div class="annotate">
      <div style={{ padding: "10px" }}>
        <h4>Annotate Relations</h4>
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
          Reset Select
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

        <h4>Selected Tags</h4>
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
  );
}
