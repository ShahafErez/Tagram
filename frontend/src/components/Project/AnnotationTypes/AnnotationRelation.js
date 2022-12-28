import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationRelation(props) {
  let TAG_COLORS = {};
  let tag_options = [];

  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  const file = props.file;

  const [tag, setTag] = useState(tag_options[0]);

  const [relationSummary, setRelationSummary] = useState(props.relationSummary);
  const [relationCurrentState, setRelationCurrentState] = useState(
    props.relationCurrentState
  );
  const [relationCount, setRelationCount] = useState(1);
  const [value, setValue] = useState(relationCurrentState);

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

  const handleValueChange = (value) => {
    setValue(value);
    setRelationCount(relationCount + 1);
    if (relationCount == 2) {
      // Saving the selected terms to be displayed constantly
      let temp_current_state = relationCurrentState;
      temp_current_state.push(createTagObject(value[value.length - 1]));
      temp_current_state.push(createTagObject(value[value.length - 2]));

      let temp_rel = relationSummary;
      temp_rel.push({
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
      setRelationCurrentState(temp_current_state);
      setRelationSummary(temp_rel);
      setRelationCount(1);
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

        <div style={{ marginTop: "15px" }}>
          <TokenAnnotator
            style={{
              padding: "5px",
              lineHeight: 1.5,
              border: "1px solid #fcc727",
              borderRadius: "2px",
            }}
            tokens={file.text.split(" ")}
            value={value}
            onChange={handleValueChange}
            getSpan={(span) => ({
              ...span,
              tag: tag,
              color: TAG_COLORS[tag],
            })}
          />
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
