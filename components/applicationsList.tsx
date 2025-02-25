import MovieLeaderboard from "@/components/applications/movieLeaderboard";
import MovieFileSize from "@/components/applications/movieFileSize";
import SeriesFileSize from "@/components/applications/seriesFileSize";
import SeriesLeaderboard from "@/components/applications/seriesLeaderboard";
import ClearUpSpace from './applications/clearUpSpace';

export const applications = [
  {
    title: "Movie Leaderboard",
    description: "All movies sorted by how many times they have been watched",
    content: <MovieLeaderboard />,
    tags: ["Jellyfin", "movies", "leaderboard", "views"]
  },
  {
    title: "Series Leaderboard",
    description: "All series sorted by how many times they have been watched",
    content: <SeriesLeaderboard />,
    tags: ["Jellyfin", "series", "leaderboard", "views"]
  },
  {
    title: "Largest movies",
    description: "A list of movies and their file sizes.",
    content: <MovieFileSize />,
    tags: ["Jellyfin", "movies", "file size"]
  },
  {
    title: "Largest series",
    description: "A list of series and their file sizes.",
    content: <SeriesFileSize />,
    tags: ["Jellyfin", "series", "file size"]
  },
  {
    title: "Clear Up Space",
    description: "A tool to help you clear up space by deleting unneeded movies and series",
    content: <ClearUpSpace />,
    tags: ["Jellyfin", "Jellyseer", "cleanup", "utils"]
  }
];
