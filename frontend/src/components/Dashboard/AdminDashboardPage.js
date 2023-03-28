import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";


export default function AdminDashboardPage() {
  let { username } = useParams();

 
  const [projects, setProjects] = useState([]);
  // getting projects TODO: filter by username
  useEffect(() => {
    fetch("/api/project/get-all")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  return (
    <div>
        
        <p>Hello {username}</p>
    </div>
  );
}
