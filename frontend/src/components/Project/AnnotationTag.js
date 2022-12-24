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

  const [value, setValue] = useState([]);
  const [tag, setTag] = useState(tag_options[0]);

  const [tagsSummarry, setTagsSummarry] = useState(props.tagsSummarry);


  const handleValueChange = (value) => {
    setValue(value);
    let temp_tags = tagsSummarry;
    temp_tags.push({Type:tag,token:value[value.length -1].tokens});
    setTagsSummarry(temp_tags);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };


  const exportTagsToFile = () =>{
    const fileData = JSON.stringify(tagsSummarry);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "tags-info.json";
    link.href = url;
    link.click();
  }

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
            {/* todo- change to be dyanmic */}
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
      </div>

      <h4>Output Value</h4>
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
      <div>
      <table>
        <tr>
          <th>Tag Type</th>
          <th>Term</th>
        </tr>
        {tagsSummarry.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.Type}</td>
              <td>{val.token}</td>
            </tr>
          )
        })}
      </table>
        </div>
        <br></br>
        <button id="saveTagsBtn" onClick={exportTagsToFile}>Export Tags to File</button>
    </div>
  );
}
