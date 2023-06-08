import React from "react";
import { Route, Routes } from "react-router-dom";
import ProjectAutomation from "./Automation/ProjectAutomation";
import AdminDashboardPage from "./Dashboard/AdminDashboardPage";
import AdminProjectPage from "./Dashboard/AdminProjectPage";
import ProjectStatistics from "./Dashboard/ProjectStatistics";
import ErrorPage from "./ErrorPage";
import HomePage from "./HomePage";
import CreateProjectPage from "./Project/CreateProjectPage";
import MyProjects from "./Project/MyProjects";
import ProjectPage from "./Project/ProjectPage";

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
      {/* login, register */}
      <Route path="/login/*" />
      <Route path="/register" />
      <Route path="/reset_password" />
      {/* Catch-all route */}
      <Route path="*" element={<ErrorPage />} />/
    </Routes>
  );
}
