import React, { useState } from "react";
import { TokenAnnotator } from "react-text-annotate";

export default function AnnotationCoOccurrence(props) {
  const file = props.file;
  let TAG_COLOR = "#fcc727";

  const [currentState, setCurrentState] = useState(
    props.coOccurrenceCurrentState
  ); // The current values being selected. saved in a matrix

  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState(
    props.coOccurrenceSummary
  ); //The saved co occurrence. Will be saved in db

  const [current_key, setCurrentKey] = useState(0);
  // tokens were selected
  function handleValueChange(key, selectedValue) {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    setCurrentKey(key);
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    let tokens_array = [];
    temp_current_state.flat().map((selection) => {
      tokens_array.push(selection.tokens);
    });

    let temp_currently_selected_array = JSON.parse(
      JSON.stringify(tokens_array)
    );
    temp_currently_selected_array.push(
      selectedValue[selectedValue.length - 1].tokens
    );
    props.onChangeCoOcurr(coOccurrenceSummary, temp_current_state);
  }

  // tokens were un-selected
  function unselectValue(key, selectedValue) {
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    let temp_currently_selected_array = [];
    for (const current_state_array of temp_current_state) {
      for (const current_state of current_state_array) {
        temp_currently_selected_array.push(current_state.tokens);
      }
    }
    props.onChangeCoOcurr(coOccurrenceSummary, temp_current_state);
  }

  // saving all current tags
  const handleSave = () => {
    let tempCoOccur = JSON.parse(JSON.stringify(coOccurrenceSummary));
    let tokensArray = [];
    // change tokens to lowercase and remove punctuation symbols
    currentState.flat().map((selection) => {
      let newTokens = [];
      selection.tokens.map((token) => {
        newTokens.push(token.toLowerCase().replace(/[^a-zA-Z ]/g, ""));
      });
      selection["tokens"] = newTokens;
      tokensArray.push(selection.tokens);
    });
    tempCoOccur.push([tokensArray]);
    setCoOccurrenceSummary(tempCoOccur);
    setCurrentState(new Array(file.length).fill([]));
    props.onChangeCoOcurr(tempCoOccur, currentState);
  };

  // Removing tagging set
  function removeSet(key) {
    let temp_co_occurrence_summary = JSON.parse(
      JSON.stringify(coOccurrenceSummary)
    );
    temp_co_occurrence_summary.splice(key, 1);
    setCoOccurrenceSummary(temp_co_occurrence_summary);
    props.onChangeCoOcurr(temp_co_occurrence_summary, currentState);
  }

  // re-setting the current state
  function handleResetSelect() {
    let new_current_state = new Array(file.length).fill([]);
    setCurrentState(new_current_state);
    props.onChangeTags(coOccurrenceSummary, new_current_state);
  }

  function processToken(tokens) {
    let tokenString = "";
    tokens.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  }

  function getUnderline(key) {
    if (key === current_key) {
      return "underline";
    }
    return "";
  }
  return (
    <div class="annotate">
      <div style={{ padding: "10px" }}>
        <h4>Annotate Co-Occurrence</h4>
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <div
                class="border border-secondary rounded"
                style={{ marginTop: "15px" }}
              >
                <div
                  class="text"
                  style={{ maxHeight: "400px", overflow: "auto" }}
                >
                  {file.map((sentence, key) => {
                    return (
                      <TokenAnnotator
                        style={{
                          padding: "5px",
                          lineHeight: 1.5,
                          textDecoration: getUnderline(key),
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
              </div>
            </div>

            <div class="col-6 col-md-4">
              <button
                class="btn btn-secondary"
                onClick={handleSave}
                style={{ marginRight: "10px" }}
              >
                save co-occurrence set
              </button>
              <button
                type="submit"
                class="btn btn-passive"
                style={{
                  backgroundColor: "#adb5bd",
                }}
                title="clear all selected tags"
                onClick={handleResetSelect}
              >
                Clear
              </button>

              <h4>Selected Co-Occurrence</h4>
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
        </div>
      </div>
    </div>
  );
}
