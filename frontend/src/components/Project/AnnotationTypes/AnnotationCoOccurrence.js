import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationCoOccurrence(props) {
  let color = "#fcc727";
  const file = props.file;

  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState(
    props.coOccurrenceSummary
  );
  const [currentState, setCurrentState] = useState(
    props.coOccurrenceCurrentState
  );
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
    props.onChangeCoOcurr(coOccurrenceSummary, currentState);
  };

  const handleSave = () => {
    let tempCoOccur = JSON.parse(JSON.stringify(coOccurrenceSummary));
    tempCoOccur.push([currentlySelectedArray]);
    setCoOccurrenceSummary(tempCoOccur);
    setCurrentState(new Array(file.length).fill([]));
    setCurrentlySelectedArray([]);
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
                  console.log("value changes");
                  handleValueChange(key, e);
                }}
                getSpan={(span) => ({
                  ...span,
                  tag: "",
                  color: color,
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
