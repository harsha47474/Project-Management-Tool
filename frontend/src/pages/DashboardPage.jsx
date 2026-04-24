import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
  Users,
  Loader2,
  GitBranch,
  BarChart3,
} from "lucide-react";
import { useProjectStore } from "../store/useProjectStore.js";
import { useTaskStore } from "../store/useTaskStore.js";
import SummaryCard from "../components/Dashboard/SummaryCard";
import ProjectOverviewCard from "../components/Dashboard/ProjectOverviewCard";
import RecentTaskItem from "../components/Dashboard/RecentTaskItem";


export default function DashboardPage() {
  const { projects, loading: projectsLoading, fetchProjects } = useProjectStore();
  const { tasks, loading: tasksLoading, fetchProjectTasks } = useTaskStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (projects.length > 0) {
      useTaskStore.setState({ tasks: [] });

      projects.forEach((project) => {
        fetchProjectTasks(project._id);
      });
    }
  }, [projects, fetchProjectTasks]);

  const loading = projectsLoading || tasksLoading;

  const recentTasks = useMemo(() => {
    return [...(tasks || [])]
      .map((task) => ({
        ...task,
        projectName:
          projects.find((project) => {
            const projectId = task.project?._id || task.project;
            return project._id === projectId;
          })?.name || "Project",
      }))
      .sort((a, b) => {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      })
      .slice(0, 3);
  }, [tasks, projects]);

  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    const counts = tasks.reduce(
      function (acc, task) {
        if (task.status === "done") acc.done += 1;
        else if (task.status === "in_progress") acc.inProgress += 1;
        else acc.todo += 1;
        return acc;
      },
      { todo: 0, inProgress: 0, done: 0 }
    );

    return {
      totalProjects,
      totalTasks,
      todo: counts.todo,
      inProgress: counts.inProgress,
      done: counts.done,
    };
  }, [projects, tasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-2 py-2 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={FolderKanban}
            title="Total Projects"
            value={metrics.totalProjects}
            subtitle="Projects you own or collaborate on"
            iconClassName="text-primary"
          />
          <SummaryCard
            icon={ListTodo}
            title="Total Tasks"
            value={metrics.totalTasks}
            subtitle="Tasks across all your projects"
            iconClassName="text-violet-500"
          />
          <SummaryCard
            icon={Clock3}
            title="In Progress"
            value={metrics.inProgress}
            subtitle="Tasks currently being worked on"
            iconClassName="text-yellow-500"
          />
          <SummaryCard
            icon={CheckCircle2}
            title="Completed"
            value={metrics.done}
            subtitle="Tasks marked as done"
            iconClassName="text-emerald-500"
          />
        </section>
        <hr className="border-border w-full" />

        <section className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="px-3">
                <h2 className="text-2xl font-semibold text-foreground">Recent Projects</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Quick access to your latest project spaces.
                </p>
              </div>
              <Link
                to="/projects"
                className="text-sm font-medium text-primary transition hover:underline"
              >
                See all
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {projects.slice(0, 2).map(function (project) {
                  return <ProjectOverviewCard key={project._id} project={project} />;
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <FolderKanban className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No projects yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first project to start organizing your team and tasks.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Task Breakdown</h2>
              </div>

              <div className="mt-10 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Todo</span>
                    <span className="font-medium text-foreground">{metrics.todo}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-slate-500"
                      style={{ width: `${metrics.totalTasks ? (metrics.todo / metrics.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">In Progress</span>
                    <span className="font-medium text-foreground">{metrics.inProgress}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-yellow-500"
                      style={{ width: `${metrics.totalTasks ? (metrics.inProgress / metrics.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Done</span>
                    <span className="font-medium text-foreground">{metrics.done}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-3 rounded-full bg-emerald-500"
                      style={{ width: `${metrics.totalTasks ? (metrics.done / metrics.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-border w-full" />

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="px-3">
              <h2 className="text-2xl font-semibold text-foreground">Recent Tasks</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your latest task activity from across projects.
              </p>
            </div>
          </div>

          {recentTasks.length > 0 ? (
            <div className="grid gap-4">
              {recentTasks.map(function (task) {
                return <RecentTaskItem key={task._id} task={task} />;
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <ListTodo className="mx-auto h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No tasks found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tasks will appear here once you create them inside a project.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
