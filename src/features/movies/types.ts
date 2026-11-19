interface MovieSummary {
  imdbId: string;
  title: string;
  year?: string;
  posterUrl?: string;
}

interface MovieDetails extends MovieSummary {
  runtime?: string;
  genre?: string;
  plot?: string;
  cast?: string;
}

export { MovieSummary, MovieDetails };
