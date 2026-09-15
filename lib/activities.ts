export type Activity = {
  id: string;
  title: string;
  type: "Academic" | "Practical" | "Research" | "Governance";
  month: "September" | "October" | "November" | "December" | "January" | "TBC";
  dateLabel: string;
  day?: number;
  status: "Completed" | "Planned" | "In planning";
  description: string;
  details: string;
};

export const activities: Activity[] = [
  {
    id: "social-media-election",
    title: "Social Media Manager election",
    type: "Governance",
    month: "September",
    day: 5,
    dateLabel: "5 September 2026 · 17:00–18:00 Riga time",
    status: "Completed",
    description:
      "Three-minute candidate presentations followed by an anonymous vote open to RSU students and staff.",
    details: "Held online. This remains listed as a transparent record of the semester programme.",
  },
  {
    id: "revision-sessions",
    title: "Cardiology revision sessions",
    type: "Academic",
    month: "TBC",
    dateLabel: "Dates to be confirmed",
    status: "Planned",
    description:
      "Focused peer-supported revision sessions for cardiovascular topics and clinical reasoning.",
    details: "Dates, topics and registration details will be added after confirmation.",
  },
  {
    id: "start-your-own-research",
    title: "Start Your Own Research",
    type: "Research",
    month: "TBC",
    dateLabel: "Date to be confirmed",
    status: "Planned",
    description:
      "A practical session introducing members to turning an idea into a structured research project.",
    details: "The programme and facilitator details are still being developed.",
  },
  {
    id: "arrhythmia-session",
    title: "RCS arrhythmia session",
    type: "Academic",
    month: "TBC",
    dateLabel: "Date to be confirmed",
    status: "Planned",
    description:
      "A dedicated RCS activity on arrhythmias, kept separate from the proposed perioperative collaboration.",
    details: "Format, venue and registration details remain to be confirmed.",
  },
  {
    id: "perioperative-simulation",
    title: "Perioperative cardiac emergency simulation",
    type: "Practical",
    month: "TBC",
    dateLabel: "Date to be confirmed",
    status: "In planning",
    description:
      "A proposed joint practical session on recognising hypotension, myocardial ischaemia and shock in theatre.",
    details: "Programme, collaborators and facilitator details have not yet been published.",
  },
];
