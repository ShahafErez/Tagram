import React, { useEffect, useState } from "react";

export default function ProjectTagsTable({ data }) {
  return (
    <div>
      {Array.from(data).map(([key, value]) => (
        <div key={key}>
          <h3>{key}</h3>
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
                    <input type="checkbox" />
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
