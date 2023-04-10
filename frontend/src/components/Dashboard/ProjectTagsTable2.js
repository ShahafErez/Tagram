import React, { useEffect, useState } from "react";
import "../../../static/css/ProjectStatistics.css";
import { Button } from "react-bootstrap";

export default function ProjectTagsTable2({ data, threshold }) {
  const [checkedRows, setCheckedRows] = useState([]);

  useEffect(() => {
    setCheckedRows(Object.keys(data).filter((key) => data[key] > threshold));
  }, []);

  const handleCheckboxChange = (event, token) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, token]);
    } else {
      setCheckedRows(checkedRows.filter((t) => t !== token));
    }
  };

  const rows = Object.entries(data).map(([tag, score]) => (
    <tr key={tag}>
      <td>
        <input
          type="checkbox"
          checked={checkedRows.includes(tag)}
          onChange={(event) => handleCheckboxChange(event, tag)}
        />
      </td>
      <td>{tag}</td>
      <td>{score}</td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Tag</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
