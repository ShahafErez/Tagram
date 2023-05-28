import React, { useEffect, useState } from "react";

export default function Kappa({ data, calcFor }) {
  const [score, setScore] = useState(0.0);
  useEffect(() => {
    fetch("/api/project/getProjectFleissKappaScore", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        data: data,
        calcFor: calcFor,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        setScore(res);
      });
  }, [data]);
  return <div>{score}</div>;
}
