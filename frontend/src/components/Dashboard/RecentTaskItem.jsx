import React from 'react'

const statusBadgeClasses = {
  todo: "bg-slate-500/15 text-slate-600 dark:text-slate-300 border border-slate-500/20",
  in_progress:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20",
  done: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
};

const priorityBadgeClasses = {  
  low: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/20",
  medium:
    "bg-violet-500/15 text-violet-700 dark:text-violet-400 border border-violet-500/20",
  high: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20",
};

const RecentTaskItem = ({ task }) => {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-foreground">{task.title}</h4>
                        <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClasses[task.status] || statusBadgeClasses.todo}`}
                        >
                            {task.status || "todo"}
                        </span>
                        <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${priorityBadgeClasses[task.priority] || priorityBadgeClasses.medium}`}
                        >
                            {task.priority || "medium"}
                        </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{task.projectName}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {task.description || "No description provided."}
                    </p>
                </div>

                <div className="shrink-0 text-xs text-muted-foreground">
                    {task.dueDate
                        ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                        : "No due date"}
                </div>
            </div>
        </div>
    );
}

export default RecentTaskItem