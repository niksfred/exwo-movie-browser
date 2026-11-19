type MovieCollection = {
  id: string;
  label: string;
  term: string;
  layout: "rail" | "rows";
};

export const batmanCollection = {
  id: "batman",
  label: "Batman",
  term: "Batman",
  layout: "rail",
} satisfies MovieCollection;

export const collections = [
  batmanCollection,
  { id: "star-trek", label: "Star Trek", term: "Star Trek", layout: "rail" },
  {
    id: "mission-impossible",
    label: "Mission: Impossible",
    term: "Mission: Impossible",
    layout: "rows",
  },
] satisfies MovieCollection[];
