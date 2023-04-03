import React, { useEffect, useState } from "react";

export default function ProjectRelationsTable({ data }) {
  const [checkedRows, setCheckedRows] = useState([]);
  const [fromToTokens, setFromToTokens] = useState({});

  useEffect(() => {
    const fromToTokensDict = {};
    data.forEach((element) => {
      const { From, To } = element;
      const fromTokens = From.tokens.join("-");
      const toTokens = To.tokens;
      if (fromToTokensDict[fromTokens]) {
        fromToTokensDict[fromTokens].push(...toTokens);
      } else {
        fromToTokensDict[fromTokens] = [...toTokens];
      }
    });
    setFromToTokens(fromToTokensDict);
  }, [data]);

  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      setCheckedRows([...checkedRows, index]);
    } else {
      setCheckedRows(checkedRows.filter((rowIndex) => rowIndex !== index));
    }
  };

  const calculateCombinationCount = (fromTokens, toTokens) => {
    //   return fromToTokens[fromTokens].length;
    if (fromToTokens[fromTokens]) {
      return fromToTokens[fromTokens].length;
    }
    return 1;
  };

  const rows = [];
  const seenRows = new Set();
  data.forEach((element, index) => {
    const { From, To } = element;
    const fromTokens = From.tokens.join("-");
    const toTokens = To.tokens.join("-");
    const rowKey = `${fromTokens}-${toTokens}`;
    if (!seenRows.has(rowKey)) {
      seenRows.add(rowKey);
      rows.push({
        key: rowKey,
        from: fromTokens,
        to: toTokens,
        combinationCount: calculateCombinationCount(fromTokens, toTokens),
      });
    }
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Select</th>
          <th>From</th>
          <th>To</th>
          <th>Combination Count</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.key}>
            <td>
              <input
                type="checkbox"
                checked={checkedRows.includes(index)}
                onChange={(event) => handleCheckboxChange(event, index)}
              />
            </td>
            <td>{row.from}</td>
            <td>{row.to}</td>
            <td>{row.combinationCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
