import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationTag(props) {
  let TAG_COLORS = {};
  let tag_options = [];

  props.labels.forEach(function (label, index) {
    TAG_COLORS[label["name"]] = label["color"];
    tag_options.push(label["name"] + "");
  });

  const file = props.file;
  const [tagsSummary, setTagsSummary] = useState(props.tagsSummary);

  const [value, setValue] = useState(tagsSummary);
  const [tag, setTag] = useState(tag_options[0]);

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

  const handleValueChange = (value) => {
    setValue(value);
    let temp_tags = tagsSummary;
    temp_tags.push(createTagObject(value[value.length - 1]));
    setTagsSummary(temp_tags);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const processToken = (value) => {
    console.log("value token ", value.token);
    let tokenString = "";
    value.token.forEach((token) => {
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
              {tagsSummary.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.Type}</td>
                    <td>{processToken(val)}</td>
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
