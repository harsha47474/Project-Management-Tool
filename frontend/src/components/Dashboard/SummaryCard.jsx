import React from "react";

const SummaryCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    iconClassName = "text-primary",
}) => {
    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-foreground">
                        {value ?? 0}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
                </div>

                <div className="rounded-2xl bg-muted p-3">
                    {Icon && <Icon className={`h-6 w-6 ${iconClassName}`} />}
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;