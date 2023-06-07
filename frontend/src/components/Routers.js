import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CreateProjectPage from "./Project/CreateProjectPage";
import ProjectPage from "./Project/ProjectPage";
import MyProjects from "./Project/MyProjects";
import AdminDashboardPage from "./Dashboard/AdminDashboardPage";
import AdminProjectPage from "./Dashboard/AdminProjectPage";
import ProjectStatistics from "./Dashboard/ProjectStatistics";
import ProjectAutomation from "./Automation/ProjectAutomation";
import ErrorPage from "./ErrorPage";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateProjectPage />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/project/:id" element={<ProjectPage />} />
      <Route
        path="/manager/dashboard/:username"
        element={<AdminDashboardPage />}
      />
      <Route path="/manager/:projectId" element={<AdminProjectPage />} />
      <Route
        path="/manager/:projectId/statistics"
        element={<ProjectStatistics />}
      />
      <Route path="/automation/:projectId" element={<ProjectAutomation />} />
      {/* Catch-all route */}
      <Route path="*" element={<ErrorPage />} />/
    </Routes>
  );
}
