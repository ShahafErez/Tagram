import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationTag(props) {
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
  const [tagsSummary, setTagsSummary] = useState(props.tagsSummary);
  const [value, setValue] = useState(props.tagsSummary);

  // Only one tag is selected at all time
  const [tag, setTag] = useState(tag_options[0]);

  const handleValueChange = (key, selectedValue) => {
    // updating the value array with the selected value
    let tempValue = JSON.parse(JSON.stringify(value));
    tempValue[key] = selectedValue;
    setValue(tempValue);

    // updating tagsSummary array
    let temp_tags_summary = JSON.parse(JSON.stringify(tagsSummary));
    let temp_tags_key = temp_tags_summary[key];
    let tagObject = createTagObject(selectedValue[selectedValue.length - 1]);
    temp_tags_key.push(tagObject);
    setTagsSummary(temp_tags_summary);

    // sending the updated tagsSummary to project page
    props.onChangeTags(temp_tags_summary);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  /** Creating a json object that will store the value of the selected tag
   * This is used for displaying the previous selected tags, even after closing the tag tab
   */
  function createTagObject(value) {
    // console.log("create tag object recived value ", value);
    return {
      Type: tag,
      token: value.tokens,
      start: value.start,
      end: value.end,
      tag: value.tag,
      color: value.color,
    };
  }

  const processToken = (value) => {
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
                  borderRadius: "2px",
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
              {tagsSummary.map((valuesArray, key) => {
                return valuesArray.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.Type}</td>
                      <td>{processToken(val)}</td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
