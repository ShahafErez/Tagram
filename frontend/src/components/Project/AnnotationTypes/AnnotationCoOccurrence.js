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
  };

  const handleSave = () => {
    let tempCoOccur = coOccurrenceSummary;
    tempCoOccur.push(coOccurrenceSet);
    setCoOccurrenceSummary(tempCoOccur);
    setCoOccurrenceSet([]);
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
                  <tr key={key}>
                    <td>
                      <div>
                        {coOccurSet.map((coOccurItem, key) => {
                          return (
                            <p style={{ margin: "0px" }}>
                              {processToken(coOccurItem.tokens)}
                            </p>
                          );
                        })}
                      </div>
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
