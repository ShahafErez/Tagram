import React, { useEffect, useState } from "react";
import "../../../static/css/ProjectStatistics.css";
import { Button } from "react-bootstrap";

export default function ProjectTagsTable({ data, updateTagsPreview }) {
  const [checkedRows, setCheckedRows] = useState([]);

  const handleCheckboxChange = (event, token) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, token]);
    } else {
      setCheckedRows(checkedRows.filter((t) => t !== token));
    }
    // console.log(relationsPreview);
    // updateRelationsPreview(Object.values(relationsPreview));
  };

  useEffect(() => {
    updateTagsPreview(checkedRows);
  }, [checkedRows]);
  return (
    <div>
      {Array.from(data).map(([key, value]) => (
        <div key={key}>
          <h3 class="table-titles">{key}</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Token</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(new Set(value.tokens)).map((token) => (
                <tr key={token}>
                  <td>
                    <input
                      type="checkbox"
                      checked={checkedRows.includes(token)}
                      onChange={(event) => handleCheckboxChange(event, token)}
                    />
                  </td>
                  <td>{token}</td>
                  <td>{value.tokens.filter((t) => t === token).length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
