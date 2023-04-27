import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export default function ProjectTagsTable2({
  data,
  threshold,
  setTagsForAlgorithm,
}) {
  const [checkedRows, setCheckedRows] = useState([]);

  useEffect(() => {
    setCheckedRows(Object.keys(data).filter((key) => data[key] > threshold));
  }, []);

  useEffect(() => {
    setTagsForAlgorithm(checkedRows);
  }, [checkedRows]);

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
    </tr>
  ));

  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Select</th>
          <th scope="col">Tag</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
