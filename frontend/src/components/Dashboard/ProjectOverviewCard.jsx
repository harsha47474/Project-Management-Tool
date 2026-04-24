import React from 'react'
import { Link } from "react-router-dom";
import { FolderKanban, Users, GitBranch, ArrowRight } from "lucide-react";

const ProjectOverviewCard = ({ project }) => {
    const memberCount = project.members?.length || 0;

    return (
        <Link
            to={`/projects/${project._id}`}
            className="group block rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition">
                            {project.name}
                        </h3>
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium capitalize text-emerald-600 dark:text-emerald-400">
                            {project.status || "active"}
                        </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {project.description || "No description added yet."}
                    </p>
                </div>
                <FolderKanban className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {memberCount} member{memberCount !== 1 ? "s" : ""}
                </span>
                {project.githubRepo ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-foreground">
                        <GitBranch className="h-3.5 w-3.5" />
                        GitHub linked
                    </span>
                ) : null}
            </div>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Open project
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

export default ProjectOverviewCard