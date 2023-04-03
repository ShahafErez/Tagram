import React, { useEffect, useState } from "react";

export default function ProjectRelationsTable({ data }) {
  const [checkedRows, setCheckedRows] = useState([]);
  const [fromToTokens, setFromToTokens] = useState({});

  useEffect(() => {
    console.log("in ProjectRelationsTable");
    console.log(data);
    for (const element in data) {
      console.log(element);
      console.log(element.From.tokens);
    }
  }, []);

  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, index]);
    } else {
      setCheckedRows(checkedRows.filter((rowIndex) => rowIndex !== index));
    }
  };

  const calculateCombinationCount = (fromTokens, toTokens) => {
    let count = 0;
    fromTokens.forEach((fromToken) => {
      toTokens.forEach((toToken) => {
        if (fromToken === toToken) {
          count++;
        }
      });
    });
    return count;
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Select</th>
          <th>From</th>
          <th>To</th>
          <th>Total Combination Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((element, index) => (
          <tr key={index}>
            <td>
              <input
                type="checkbox"
                checked={checkedRows.includes(index)}
                onChange={(event) => handleCheckboxChange(event, index)}
              />
            </td>
            <td>{element.From.tokens.join(", ")}</td>
            <td>{element.To.tokens.join(", ")}</td>
            <td>
              {calculateCombinationCount(
                element.From.tokens,
                element.To.tokens
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
