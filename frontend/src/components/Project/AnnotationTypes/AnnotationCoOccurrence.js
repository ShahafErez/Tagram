import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationCoOccurrence(props) {
  const file = props.file;
  let TAG_COLOR = "#fcc727";

  /* The current values being selected. Displaying the select on text.
    Each line in file will be a separate array */
  const [currentState, setCurrentState] = useState(
    props.coOccurrenceCurrentState
  );
  /* The saved relations. Will be saved in db
   * Saving all values in a single array */
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState(
    props.coOccurrenceSummary
  );
  /* The current values being selected
   * Saving all values in a single array */
  const [currentlySelectedArray, setCurrentlySelectedArray] = useState([]);

  const handleValueChange = (key, selectedValue) => {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);
    let temp_currently_selected_array = JSON.parse(
      JSON.stringify(currentlySelectedArray)
    );
    temp_currently_selected_array.push(
      selectedValue[selectedValue.length - 1].tokens
    );
    setCurrentlySelectedArray(temp_currently_selected_array);
    props.onChangeCoOcurr(coOccurrenceSummary, temp_current_state);
  };

  /**
   * Unselecting token
   * Re-rendering currently selected array
   */
  const unselectValue = (key, selectedValue) => {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    let temp_currently_selected_array = [];
    for (const current_state_array of temp_current_state) {
      for (const current_state of current_state_array) {
        temp_currently_selected_array.push(current_state.tokens);
      }
    }
    setCurrentlySelectedArray(temp_currently_selected_array);
    props.onChangeCoOcurr(coOccurrenceSummary, temp_current_state);
  };

  /**
   * Saving a currently selected array in co occurrence summary
   * And re-setting the currently selected array
   */
  const handleSave = () => {
    let tempCoOccur = JSON.parse(JSON.stringify(coOccurrenceSummary));
    tempCoOccur.push([currentlySelectedArray]);
    setCoOccurrenceSummary(tempCoOccur);
    setCurrentState(new Array(file.length).fill([]));
    setCurrentlySelectedArray([]);
    props.onChangeCoOcurr(tempCoOccur, currentState);
  };

  /**
   * Removing tagging set
   */
  const removeSet = (key) => {
    let temp_co_occurrence_summary = JSON.parse(
      JSON.stringify(coOccurrenceSummary)
    );
    temp_co_occurrence_summary.splice(key, 1);
    setCoOccurrenceSummary(temp_co_occurrence_summary);
    props.onChangeCoOcurr(temp_co_occurrence_summary, currentState);
  };

  const processToken = (tokens) => {
    let tokenString = "";
    tokens.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  };

  return (
    <div class="annotate">
      <div style={{ padding: "10px" }}>
        <h4>Annotate Co-Occurrence</h4>
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
                    handleValueChange(key, e);
                  }
                }}
                getSpan={(span) => ({
                  ...span,
                  tag: "",
                  color: TAG_COLOR,
                })}
              />
            );
          })}
        </div>
        <button class="btn btn-secondary" onClick={handleSave}>
          save co-occurrence set
        </button>
        <h4>Selected Sets</h4>
        <div style={{ width: "80%", margin: "auto" }}>
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {coOccurrenceSummary.map((coOccurSet, key) => {
                return (
                  <tr>
                    <td>
                      {coOccurSet.map((coOccurItem, key) => {
                        return (
                          <div>
                            {coOccurItem.map((item, key) => {
                              return (
                                <p style={{ margin: "0px" }}>
                                  {processToken(item)}
                                </p>
                              );
                            })}
                          </div>
                        );
                      })}
                    </td>
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
    </div>
  );
}
