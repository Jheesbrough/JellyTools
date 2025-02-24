import React from 'react';
import Button from '@mui/material/Button';
import { useJellyfin } from '../../contexts/apiContexts';
import { Typography } from '@mui/material';

export default class fileSize {
  title: string;
  description: string;
  jellyfin: any;

  constructor() {
    this.title = "Movie File Size";
    this.description = "A list of movies and their file sizes.";
    this.jellyfin = useJellyfin();
  }

  getBasicInfo() {
    return {
      title: this.title,
      description: this.description
    };
  }

  async handleButtonClick() {
    if (!this.jellyfin.authorised) {
      return;
    }
    const films = await this.jellyfin.makeRequest("Items", { IncludeItemTypes: "Movie", Recursive: true });
    console.log(films);
    // Process films in batches of 2 to get the file size and name
    for (let i = 0; i < films.Items.length; i += 2) {
      await Promise.all(films.Items.slice(i, i + 2).map(async (film: any) => {
      const fileSize = await this.jellyfin.makeRequest(`Items/${film.Id}`);
      film.size = fileSize[0].Size;
      }));
    }
    const resultElement = document.getElementById("Result");
    if (resultElement) {
      resultElement.innerHTML = `
      <table>
        <thead>
        <tr>
          <th>Movie Name</th>
          <th>File Size</th>
        </tr>
        </thead>
        <tbody>
        ${films.Items.map(film => `
          <tr>
            <td>${film.Name}</td>
            <td>${film.size}</td>
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
