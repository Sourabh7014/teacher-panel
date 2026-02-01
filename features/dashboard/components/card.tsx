import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const ChartCard: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  description,
  action,
}) => {
  return (
    <div
      className={`bg-card rounded-xl border border-zinc-800 shadow-sm overflow-hidden ${className}`}
    >
      {(title || description || action) && (
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-start">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-zinc-400 mt-1">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
