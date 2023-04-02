import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import AdminDashboardProjectTable from "./AdminDashboardProjectTable";
import "../../../static/css/AdminDashboardProjectTable.css";


export default function AdminDashboardPage() {
  let { username } = useParams();

  const [projects, setProjects] = useState([]);
  // getting projects
    // TODO: filter by username
  useEffect(() => {
    fetch("/api/project/get-all")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        // console.log(data);
      });
  }, []);

  

  return (
    <div>
      <div>
      <h2 style={{ margintTop: "5px", marginBottom: "20px" }}>
        Hello {username}
      </h2>
      </div>
      <div>
      {/* {projects.length>0 && <p> {projects.length}</p>} */}
      {projects && <AdminDashboardProjectTable data={projects}/>}
      </div>
    </div>
  );
}
