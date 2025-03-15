# JellyTools

<!-- Shields.io -->
![GitHub](https://img.shields.io/github/license/jheesbrough/JellyTools) ![GitHub last commit](https://img.shields.io/github/last-commit/jheesbrough/JellyTools) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/jheesbrough/JellyTools) [![Website](https://img.shields.io/website?logo=jellyfin&url=https%3A%2F%2Fjellytools.j33.xyz&logoColor=pink)](https://jellytools.j33.xyz)

**🚀 Deployed at:** [jellytools.j33.xyz](https://jellytools.j33.xyz).

The JellyTools webapp is a collection of external tools to help manage your [Jellyfin](https://github.com/jellyfin/jellyfin) media server. It uses both the Jellyfin API and the Jellyseer API to fetch data and run various housekeeping tasks.

## Features

- [x] Clean up space on your server by removing old, unwatched media
- [x] Fetch the most watched movies and shows
- [ ] Create sharable graphics and statistics
- [ ] Get lists of most and least active users
- [ ] Create nice shareable links to media

## Developing

Built on node with Next, Tailwind and TypeScript and MUI components. Issues and PRs are welcome.

### Important quirks

- Jellyseer does not allow client->server communication, so the requests are proxied through the Next.js route `/api/proxy`.

- Jellyfin uses its API token in the authentication header as`Mediabrowser Token="token"` header, while Jellyseer uses the header X-Api-Key.

- For the 'date added' behaviour to work as expected, use the date scanned into the library, not the date the file was created. This can be changed in your Jellyfin settings under Libraries > Display.
