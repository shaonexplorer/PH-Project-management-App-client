"use client";

import TaskCard from "./Task-card";

function TaskList() {
  return (
    <div className="w-full  grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <TaskCard />
      <TaskCard />
    </div>
  );
}

export default TaskList;
