import React, { useEffect, useState } from "react";

export default function ProjectRelationsTable2({
  data,
  threshold,
  setRelationsForAlgorithm,
}) {
  const [checkedRows, setCheckedRows] = useState([]);

  useEffect(() => {
    setCheckedRows(Object.keys(data).filter((key) => data[key] > threshold));
  }, []);

  useEffect(() => {
    setRelationsForAlgorithm(checkedRows);
  }, [checkedRows]);

  const handleCheckboxChange = (event, token) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, token]);
    } else {
      setCheckedRows(checkedRows.filter((t) => t !== token));
    }
  };

  const rows = Object.entries(data).map(([rel, score]) => (
    <tr key={rel}>
      <td>
        <input
          type="checkbox"
          checked={checkedRows.includes(rel)}
          onChange={(event) => handleCheckboxChange(event, rel)}
        />
      </td>
      <td>{rel}</td>
    </tr>
  ));

  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Select</th>
          <th scope="col">Relation</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
