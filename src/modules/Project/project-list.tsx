"use client";

import ProjectInfoCard from "./project-card";

function ProjectList() {
  return (
    <div className="w-full  grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
      <ProjectInfoCard />
      <ProjectInfoCard />
      <ProjectInfoCard />

      <ProjectInfoCard />
      <ProjectInfoCard />
      <ProjectInfoCard />
    </div>
  );
}

export default ProjectList;
