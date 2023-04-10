import React, { useEffect, useState } from "react";
import "../../../static/css/ProjectStatistics.css";
import { Button } from "react-bootstrap";

export default function ProjectTagsTable2({ data }) {
  console.log(data);
  const rows = Object.entries(data).map(([tag, score]) => (
    <tr key={tag}>
      <td>
        <input type="checkbox" />
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
