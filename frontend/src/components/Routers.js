import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "./HomePage";
import CreateProjectPage from "./Project/CreateProjectPage";
import ProjectPage from "./Project/ProjectPage";
import SelectLabels from "./Project/SelectLabels";
import Annotation from "./Project/Annotation";

export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateProjectPage />} />
      <Route path="/project/:id" element={<ProjectPage />} />
      <Route path="/meta/:id" element={<SelectLabels />} />
      <Route path="/annotate" element={<Annotation />} />
    </Routes>
  );
}
