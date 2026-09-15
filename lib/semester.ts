export type Semester = {
  key: string;
  name: string;
  season: "Spring" | "Autumn";
  start: string;
  end: string;
  months: string[];
};

function formatYearPair(startYear: number) {
  return `${startYear}/${String(startYear + 1).slice(-2)}`;
}

export function getSemester(date = new Date()): Semester {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  if (month >= 1 && month <= 7) {
    return {
      key: `spring-${year}`,
      name: `Spring ${year}`,
      season: "Spring",
      start: `${year}-02-01`,
      end: `${year}-08-31`,
      months: ["February", "March", "April", "May", "June", "July", "August"],
    };
  }

  const startYear = month === 0 ? year - 1 : year;
  return {
    key: `autumn-${startYear}-${String(startYear + 1).slice(-2)}`,
    name: `Autumn ${formatYearPair(startYear)}`,
    season: "Autumn",
    start: `${startYear}-09-01`,
    end: `${startYear + 1}-01-31`,
    months: ["September", "October", "November", "December", "January"],
  };
}

export function formatSemesterRange(semester: Semester) {
  return semester.season === "Spring"
    ? "1 February–31 August"
    : "1 September–31 January";
}
