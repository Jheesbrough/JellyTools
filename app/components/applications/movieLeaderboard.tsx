import React from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '../../contexts/apiContexts';
import { Typography } from '@mui/material';

export default class MovieLeaderboard {
  title: string;
  description: string;
  jellyfin: any;

  constructor() {
    this.title = "Movie Leaderboard";
    this.description = "A list of top-rated movies based on user ratings.";
    this.jellyfin = useJellyfin();
  }

  getBasicInfo() {
    return {
      title: this.title,
      description: this.description
    };
  }

  async handleButtonClick() {
    if (!this.jellyfin.authorised){
      return;
    }
    const users = await this.jellyfin.makeRequest("users");
    const movieCount: { [key: string]: number } = {};

    // Foreach get watched media
    for (const user of users) {
      const watched = await this.jellyfin.makeRequest(`users/${user.Id}/items?IncludeItemTypes=Movie&Recursive=true&Filters=IsPlayed&SortBy=SortName&SortOrder=Ascending`);
      watched.Items.forEach((item: any) => {
      if (movieCount[item.Name]) {
        movieCount[item.Name]++;
      } else {
        movieCount[item.Name] = 1;
      }
      });
    }

    // Sort the movies by the number of times they were watched
    const watchedMovies = Object.entries(movieCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    const resultElement = document.getElementById("Result");
    if (resultElement) {
      resultElement.innerHTML = `
      <table>
        <thead>
        <tr>
          <th>Movie Name</th>
          <th>Watched Count</th>
        </tr>
        </thead>
        <tbody>
        ${watchedMovies.map(movie => `
          <tr>
          <td>${movie.name}</td>
          <td>${movie.count}</td>
          </tr>
        `).join('')}
        </tbody>
      </table>
      `;
    }
  }

  getContent() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.handleButtonClick.bind(this)}>
          View Leaderboard
        </Button>
        <Typography variant="body1" color="textSecondary" id="Result" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          Result
        </Typography>
      </div>
    );
  }
}
