import { TokenAnnotator } from "react-text-annotate";
import React, { useState } from "react";

export default function AnnotationCoOccurrence(props) {
  const file = props.file;
  const [coOccurrenceSummary, setCoOccurrenceSummary] = useState(
    props.coOccurrenceSummary
  );
  const [color, setColor] = useState("#fbed56");

  const [coOccurrenceSet, setCoOccurrenceSet] = useState([]);

  const handleValueChange = (value) => {
    setCoOccurrenceSet(value);
    // let tempSet = coOccurrenceSet;
    // tempSet.push(value[value.length - 1].tokens);
    // tempSet.push(value);
    // setCoOccurrenceSet(tempSet);
    console.log("9 ", coOccurrenceSet);
    // let temp_selection = coOccurrenceSummary;
    // temp_selection.push();
    // setCoOccurrenceSummary(temp_selection);
  };

  const handleSave = () => {
    // console.log("hanlde sa")
    let tempCoOccur = coOccurrenceSummary;
    tempCoOccur.push(coOccurrenceSet);
    setCoOccurrenceSummary(tempCoOccur);
    console.log(coOccurrenceSummary);
    setCoOccurrenceSet([]);
  };

  const exportTagsToFile = () => {
    const fileData = JSON.stringify(coOccurrenceSummary);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "co-occurrence-info.json";
    link.href = url;
    link.click();
  };

  return (
    <div class="annotate">
      <div style={{ padding: "10px" }}>
        <h4>Annotate Co-Occurrence</h4>
        <div style={{ marginTop: "15px" }}>
          <TokenAnnotator
            style={{
              padding: "5px",
              lineHeight: 1.5,
              border: "1px solid #fcc727",
              borderRadius: "2px",
            }}
            tokens={file.text.split(" ")}
            value={coOccurrenceSet}
            onChange={handleValueChange}
            getSpan={(span) => ({
              ...span,
              tag: "",
              color: color,
            })}
          />
          <button class="btn btn-secondary" onClick={handleSave}>
            save co-occurrence set
          </button>
        </div>
        <h4>Output Value</h4>
        <div>
          {coOccurrenceSummary.map((coOccurSet, key) => {
            return (
              <ul>
                <p>set {key}</p>
                {coOccurSet.map((coOccurItem, key) => {
                  return <li>{coOccurItem.tokens}</li>;
                })}
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
}
