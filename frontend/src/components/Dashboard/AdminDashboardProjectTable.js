import React, { useEffect, useState } from "react";

export default function AdminDashboardProjectTable({ data }) {

    const[currentProjectStatistics, setCurrentProjectStatistics] = useState([]);
    useEffect(() => {
        console.log("in AdminDashboardProjectTable");
        console.log(data);
      }, []);

      const showProjectStatistics = (id) => {
        // fetch("/api/project/get-statistics", {
        //   method: "GET",
        //   headers: { "Content-Type": "application/json ; charset=utf-8" },
        //   body: JSON.stringify({
        //     project_id: id,
        //   }),
        // }).then((response) => response.json())
        // .then((data) => {
        //   setCurrentProjectStatistics(data);
        //   console.log(data);
        // });
      };

  return (
    <table>
      <thead>
        <tr>
          <th>project_id</th>
          <th>title</th>
          <th>description</th>
          <th>meta_tagging</th>
          <th>project_manager</th>
          <th>created_at</th>
          <th>get statistics</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.project_id}>
            <td>{item.project_id}</td>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{item.meta_tagging}</td>
            <td>{item.project_manager}</td>
            <td>{item.created_at}</td>
            <td><button onClick={showProjectStatistics(item.project_id)}>Show</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

