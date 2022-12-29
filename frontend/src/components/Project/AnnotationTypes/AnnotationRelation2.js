import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationRelation2(props) {
  let TAG_COLORS = {};
  let tag_options = [];

  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  const [currentState, setCurrentState] = useState(props.relationCurrentState);
  /**
   * To support multi-lines files, we set the below variable to be an array
   * the size of the array will be the number of lines in the file
   */
  const file = props.file;
  const [relationSummary, setRelationSummary] = useState(props.relationSummary);

  const [relationCount, setRelationCount] = useState(1);
  // Only one tag is selected at all time
  const [tag, setTag] = useState(tag_options[0]);

  const handleValueChange = (key, selectedValue) => {
    // updating the current selected value
    let temp_current_state = JSON.parse(JSON.stringify(currentState));
    temp_current_state[key] = selectedValue;
    setCurrentState(temp_current_state);

    setRelationCount(relationCount + 1);

    if (relationCount == 2) {
      let temp_rel = JSON.parse(JSON.stringify(relationSummary));
      temp_rel.push({
        Type: tag,
        From: selectedValue[selectedValue.length - 2].tokens,
        To: selectedValue[selectedValue.length - 1].tokens,
        From_start_end: [
          selectedValue[selectedValue.length - 2].start,
          selectedValue[selectedValue.length - 2].end,
        ],
        To_start_end: [
          selectedValue[selectedValue.length - 1].start,
          selectedValue[selectedValue.length - 1].end,
        ],
      });
      setRelationSummary(temp_rel);
      setRelationCount(1);

      // sending the updated variables to project page
      props.onChangeRelation(relationSummary, currentState);
    }
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  /** Creating a json object that will store the value of the selected tag
   * This is used for displaying the previous selected tags, even after closing the tag tab
   */
  function createTagObject(value) {
    return {
      Type: tag,
      token: value.tokens,
      start: value.start,
      end: value.end,
      tag: value.tag,
      color: value.color,
    };
  }

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
                  console.log("value changes");
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

        <h4>Selected Tags</h4>
        <div style={{ width: "80%", margin: "auto" }}>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Term From</th>
                <th scope="col">Term To</th>
              </tr>
            </thead>
            <tbody>
              {relationSummary.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.Type}</td>
                    <td>{processToken(val.From)}</td>
                    <td>{processToken(val.To)}</td>
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
