# Sample Node.js JavaScript Deploy App

A lightweight Node.js + Express server that serves an embedded postMessage listener frontend. This replaces the Python FastAPI version with a more accessible setup for Windows environments.

## Features

- ✅ **No Python required** – runs on Node.js
- ✅ **Minimal dependencies** – just Express
- ✅ **Windows-friendly** – simple setup
- ✅ **Production-ready structure** – clean and maintainable
- ✅ **Static file serving** – CSS, JS, and images
- ✅ **Health check endpoint** – for monitoring

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation & Running

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The app will be available at **http://localhost:3000**

## Project Structure

```
Sample-Node-Javascript-Deploy-App/
├── server.js              # Main Express application
├── package.json           # Dependencies and scripts
├── README.md              # This file
├── static/                # Static assets
│   ├── embedded.css       # Basic styling
│   ├── embedded.js        # Client-side postMessage handler
│   └── css/
│       └── style.css      # Enhanced dark theme styling
└── templates/
    └── embedded.html      # Main HTML page
```

## Endpoints

- `GET /` – Main application page
- `GET /health` – Health check (returns JSON)
- `GET /inference` – Mock inference endpoint (optional)
- `GET /static/*` – Static assets (CSS, JS)

## SD-JWT Validation

This repository includes a Node.js helper module for validating SD-JWT tokens against the Mayo Clinic Platform introspection endpoint. In production environments, you should not implicitly trust the sd-jwt provided to you. Especially if you are using the username to provide SSO capabilities into your software. Tokens must be validated upon initial receipt against the introspection endpoint. Do not rely on the token alone as proof of validity.

Use `validate_sd_jwt.js` as a sample backend helper when the SD-JWT is received via `postMessage`.

```js
const { validateSdJwt } = require('./validate_sd_jwt');

async function handleIncomingMessage({ mayoprovidedSecretToken, sdJwt }) {
  try {
    const result = await validateSdJwt({
      token: mayoprovidedSecretToken,
      sdJwt,
    });
    console.log('Introspection result:', result);
  } catch (err) {
    console.error('SD-JWT validation failed:', err);
  }
}
```

The default introspection endpoint is `https://catswebapi.mcp.org/api/v1/token/introspect`.



```js
await validateSdJwt({
  token: mayoprovidedSecretToken,
  sdJwt,
  host: 'catswebapi.mcp.org',
  path: '/api/v1/token/introspect',
});
```

## Configuration

### Port

By default, the server runs on port 3000. To use a different port:

```bash
# Windows PowerShell
$env:PORT=8080; npm start

# Windows Command Prompt
set PORT=8080 && npm start

# Linux/Mac
PORT=8080 npm start
```

## Frontend Details

The frontend listens for `postMessage` events from parent frames and:

1. Receives JSON payloads containing patient/context data
2. Displays the received payload
3. Queries FHIR data from a configured gateway (if provided)
4. Handles microphone access requests

See [embedded.js](static/embedded.js) for implementation details.

## Adding Dependencies

To add new npm packages:

```bash
npm install package-name
```

Then update and commit `package.json` and `package-lock.json`.

## Deployment

This app is suitable for deployment on:

- ✅ Windows IIS with Node.js runtime
- ✅ Docker containers
- ✅ Cloud platforms (Azure, AWS, Heroku, etc.)
- ✅ Local development environments

## Development

To make changes:

1. Edit files in `templates/` or `static/`
2. Restart the server with `npm start`
3. Browser refresh to see changes

For hot-reload during development, consider using `nodemon`:

```bash
npm install --save-dev nodemon
npx nodemon server.js
```

## Notes

- Static files are served with caching headers enabled by default
- The `/health` endpoint is useful for load balancer health checks
- CORS is not enabled by default; add middleware if needed for cross-origin requests

## License

MIT
