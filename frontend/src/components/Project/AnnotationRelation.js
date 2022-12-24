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

  const [value, setValue] = useState([]);
  const [tag, setTag] = useState(tag_options[0]);

  const [relationSummarry, setRelationSummary] = useState(props.relationSummarry);
  // let relationSummarry = props.relationSummarry;
  const [ relationCount, setRelationCount] = useState(1);

  const handleValueChange = (value) => {
    setValue(value);
    setRelationCount(relationCount+1);
    if (relationCount==2){
      let temp_rel = relationSummarry;
      temp_rel.push({Type:tag,From:value[value.length -2].tokens,To:value[value.length -1].tokens,From_start_end:[value[value.length -2].start,value[value.length -2].end], To_start_end:[value[value.length -1].start,value[value.length -1].end]});
      setRelationSummary(temp_rel);
      setRelationCount(1);
    }
    console.log(relationSummarry);
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };


  const exportRelationsToFile = () =>{
    const fileData = JSON.stringify(relationSummarry);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "relations-info.json";
    link.href = url;
    link.click();
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

      <h4>Relations</h4>
      {/* <pre>{JSON.stringify(value, null, 2)}</pre> */}
      <div>
      <table>
        <tr>
          <th>Type</th>
          <th>From</th>
          <th>To</th>
        </tr>
        {relationSummarry.map((val, key) => {
          return (
            <tr key={key}>
              <td>{val.Type}</td>
              <td>{val.From}</td>
              <td>{val.To}</td>
            </tr>
          )
        })}
      </table>
        </div>
        <br></br>
        <button id="saveRelationBtn" onClick={exportRelationsToFile}>Export Relations to File</button>
    </div>
  );
}
