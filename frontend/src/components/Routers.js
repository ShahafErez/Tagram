import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import CreateProjectPage from "./Project/CreateProjectPage";
import ProjectPage from "./Project/ProjectPage";
import MyProjects from "./Project/MyProjects";
import AdminDashboardPage from "./Dashboard/AdminDashboardPage";
import CorrectnessPage from "./Project/CorrectnessPage";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateProjectPage />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/project/:id" element={<ProjectPage />} />
      <Route path="/dashboard/:username" element={<AdminDashboardPage />} />
      <Route path="/correct" element={<CorrectnessPage />} />
    </Routes>
  );
}
