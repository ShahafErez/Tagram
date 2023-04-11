import React, { useEffect, useState } from "react";
import ProjectStatistics from "./ProjectStatistics";
import { Button } from "react-bootstrap";

export default function AdminDashboardProjectTable({ data }) {
  const [currentProject, setCurrentProject] = useState("");

  const showProjectStatistics = (id) => {
    setCurrentProject(id);
  };

  return (
    <div>
      <div>
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
                <td>
                  <Button
                    variant="primary"
                    onClick={() => showProjectStatistics(item.project_id)}
                  >
                    Show
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <br></br>
        {currentProject && <ProjectStatistics project_id={currentProject} />}
      </div>
    </div>
  );
}
