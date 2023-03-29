import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import AdminDashboardProjectTable from "./AdminDashboardProjectTable";


export default function AdminDashboardPage() {
  let { username } = useParams();

 
  const [projects, setProjects] = useState([]);
  // getting projects TODO: filter by username
  useEffect(() => {
    console.log("in AdminDashboardPage");
    fetch("/api/project/get-all")
      .then((response) => {
        console.log(response);
        response.json();})
      .then((data) => {
        setProjects(data);
        console.log("after set");
      });
  }, []);

  return (
    <div>
      <div>
       <p>Hello !!! {username} !!</p>
      </div>
      <div>
      {projects.length>0 && <p> {projects.length}</p>}
        <AdminDashboardProjectTable data={projects}/>
      </div>
    </div>
  );
}
