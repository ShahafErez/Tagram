import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export default function Kappa({ data }) {
  // console.log("*********************** in Kappa, data is: ");
  // console.log(data);
  const [score, setScore] = useState(0.0);
  //   console.log(data);
  useEffect(() => {
    fetch("/api/project/getProjectFleissKappaScore", {
      method: "POST",
      headers: { "Content-Type": "application/json ; charset=utf-8" },
      body: JSON.stringify({
        data: data,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        // console.log("RESPONSE in KAPPA:");
        // console.log(res);
        setScore(res);
      });
  }, [data]);
  return <div>{score}</div>;
}
