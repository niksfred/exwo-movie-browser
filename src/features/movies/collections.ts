type MovieCollection = {
  id: string;
  label: string;
  term: string;
  layout: "rail" | "rows";
};

export const rowCollection = {
  id: "mission-impossible",
  label: "Mission: Impossible",
  term: "Mission: Impossible",
  layout: "rows",
} satisfies MovieCollection;

export const collections = [
  { id: "batman", label: "Batman", term: "Batman", layout: "rail" },
  { id: "star-trek", label: "Star Trek", term: "Star Trek", layout: "rail" },
  rowCollection,
] satisfies MovieCollection[];
