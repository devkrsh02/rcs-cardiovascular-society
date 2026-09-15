"use client";

import { useMemo, useState } from "react";
import { activities } from "@/lib/activities";

const monthOptions = ["All", "September", "October", "November", "December", "January", "TBC"];
const typeOptions = ["All", "Academic", "Practical", "Research", "Governance"];

export function ActivityBrowser({ semester }: { semester: string }) {
  const [month, setMonth] = useState("All");
  const [type, setType] = useState("All");

  const filtered = useMemo(
    () =>
      activities.filter(
        (activity) =>
          (month === "All" || activity.month === month) &&
          (type === "All" || activity.type === type),
      ),
    [month, type],
  );

  return (
    <div className="activity-browser">
      <div className="calendar-strip" role="group" aria-label="Filter activities by month">
        {monthOptions.map((option) => (
          <button
            type="button"
            key={option}
            className={month === option ? "active" : ""}
            aria-pressed={month === option}
            onClick={() => setMonth(option)}
          >
            <small>{option === "All" ? semester : option === "TBC" ? "Unscheduled" : "Month"}</small>
            <strong>{option}</strong>
          </button>
        ))}
      </div>

      <div className="filter-row">
        <div role="group" aria-label="Filter activities by type">
          {typeOptions.map((option) => (
            <button
              type="button"
              key={option}
              className={type === option ? "active" : ""}
              aria-pressed={type === option}
              onClick={() => setType(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          <strong>{filtered.length}</strong> {filtered.length === 1 ? "activity" : "activities"}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="activity-list">
          {filtered.map((activity) => (
            <article className="activity-row" key={activity.id}>
              <div className="date-block">
                {activity.day ? (
                  <>
                    <strong>{activity.day}</strong>
                    <span>SEP</span>
                  </>
                ) : (
                  <>
                    <strong>—</strong>
                    <span>TBC</span>
                  </>
                )}
              </div>
              <div className="activity-main">
                <div className="activity-meta">
                  <span>{activity.type}</span>
                  <span className={`status status-${activity.status.toLowerCase().replaceAll(" ", "-")}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="activity-date">{activity.dateLabel}</p>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <details>
                  <summary>Details</summary>
                  <p>{activity.details}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No matching activities yet.</h3>
          <p>Choose another month or activity type.</p>
        </div>
      )}
    </div>
  );
}
