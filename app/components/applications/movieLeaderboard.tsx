import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '../../contexts/apiContexts';
import { Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from '@mui/material';

const MovieLeaderboard: React.FC = () => {
  const [sortMethod, setSortMethod] = useState<string>('played');
  const [watchedMovies, setWatchedMovies] = useState<{ name: string; count: number }[]>([]);
  const jellyfin = useJellyfin();

  const title = "Movie Leaderboard";
  const description = "A list of top-rated movies based on user ratings.";

  const getBasicInfo = () => {
    return {
      title,
      description
    };
  };

  const handleSortMethodChange = (event: SelectChangeEvent<string>) => {
    setSortMethod(event.target.value as string);
  };

  const handleButtonClick = async () => {
    if (!jellyfin.authorised) {
      return;
    }
    const users = await jellyfin.makeRequest("users");
    const movieCount: { [key: string]: number } = {};

    for (const user of users) {
      const watched = await jellyfin.makeRequest(`users/${user.Id}/items?IncludeItemTypes=Movie&Recursive=true&Filters=IsPlayed&SortBy=SortName&SortOrder=Ascending`);
      watched.Items.forEach((item: any) => {
        const count = sortMethod === 'played' ? 1 : item.UserData.PlayCount || 0;
        if (movieCount[item.Name]) {
          movieCount[item.Name] += count;
        } else {
          movieCount[item.Name] = count;
        }
      });
    }

    const watchedMovies = Object.entries(movieCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    setWatchedMovies(watchedMovies);
  };

  return (
    <div style={{ padding: '16px' }}>
      <FormControl variant="outlined" style={{ marginBottom: '16px' }}>
        <InputLabel id="sort-method-label">Sort By</InputLabel>
        <Select
          labelId="sort-method-label"
          value={sortMethod}
          onChange={handleSortMethodChange}
          label="Sort By"
        >
          <MenuItem value="played">Played Tag</MenuItem>
          <MenuItem value="playCount">Play Count</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        View Leaderboard
      </Button>
      <TableContainer component={Paper} style={{ maxHeight: '250px', overflowY: 'auto', marginTop: '16px', paddingBottom: '16px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Movie Name</TableCell>
              <TableCell>Watched Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {watchedMovies.map(movie => (
              <TableRow key={movie.name + movie.count}>
                <TableCell>{movie.name}</TableCell>
                <TableCell>{movie.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MovieLeaderboard;