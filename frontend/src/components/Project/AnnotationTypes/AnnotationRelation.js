import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationRelation(props) {
  let TAG_COLORS = {};
  let tag_options = [];

  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  /**
   * To support multi-lines files, we set the below variable to be an array
   * the size of the array will be the number of lines in the file
   */
  const file = props.file;
  const [relationSummary, setRelationSummary] = useState(props.relationSummary);
  // Array saving the current state of the values, for displying
  const [relationCurrentState, setRelationCurrentState] = useState(
    props.relationCurrentState
  );
  const [value, setValue] = useState(relationCurrentState);

  const [relationCount, setRelationCount] = useState(1);
  // Only one tag is selected at all time
  const [tag, setTag] = useState(tag_options[0]);

  const handleValueChange = (key, selectedValue) => {
    console.log("handle change");
    // updating the value array with the selected value
    let tempValue = JSON.parse(JSON.stringify(value));
    tempValue[key] = selectedValue;
    setValue(tempValue);

    setRelationCount(relationCount + 1);
    if (relationCount == 2) {
      // Saving the selected terms to be displayed
      let temp_current_state = JSON.parse(JSON.stringify(relationCurrentState));
      temp_current_state.push(createTagObject(value[value.length - 1]));
      temp_current_state.push(createTagObject(value[value.length - 2]));
      setRelationCurrentState(temp_current_state);

      // updating relationSummary array
      let temp_relation_summary = JSON.parse(JSON.stringify(relationSummary));
      let temp_tags_value = temp_relation_summary[key];
      temp_tags_value.push({
        Type: tag,
        From: value[value.length - 2].tokens,
        To: value[value.length - 1].tokens,
        From_start_end: [
          value[value.length - 2].start,
          value[value.length - 2].end,
        ],
        To_start_end: [
          value[value.length - 1].start,
          value[value.length - 1].end,
        ],
      });
      setRelationSummary(temp_relation_summary);
      setRelationCount(1);

      // sending the updated tagsSummary to project page
      props.onChangeRelation(temp_relation_summary);
    }
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const processToken = (tokens) => {
    let tokenString = "";
    tokens.forEach((token) => {
      tokenString += " " + token;
    });
    return tokenString;
  };

  // Creating a json object that will store the value of the selected relations
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
                value={value[key]}
                onChange={(e) => {
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

        <h4>Selected Relations</h4>
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
                    {/* <td>{val.Type}</td> */}
                    {/* <td>{processToken(val.From)}</td> */}
                    {/* <td>{processToken(val.To)}</td> */}
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
