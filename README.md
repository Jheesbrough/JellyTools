# Jellyfin tools

This is (or will be) a collection of tools for the Jellyfin media server.

## Features

## Developing

```bash
npm install
npm run dev
```

Supports using the Jellyfin and Jellyseer API to manage media libraries and run common tasks.

### Important quirks

- Jellyseer does not allow client->server communication, so the requests are proxied through the Next.js route `/api/proxy`.

- Jellyfin uses its API token in the authentication header as`Mediabrowser Token="token"` header, while Jellyseer uses the header X-Api-Key.