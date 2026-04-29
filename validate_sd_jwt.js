#!/usr/bin/env node
const https = require('https');
const { URLSearchParams } = require('url');

/**
 * Validate an SD-JWT by making a token introspection call.
 *
 * @param {Object} params
 * @param {string} params.token - The Mayo-provided secret token.
 * @param {string} params.sdJwt - The SD-JWT value to validate.
 * @param {string} [params.host='catswebapi.mcp.org'] - The introspection host.
 * @param {string} [params.path='/api/v1/token/introspect'] - The introspection path.
 * @returns {Promise<unknown>} The parsed response from the introspection endpoint.
 */
function validateSdJwt({ token, sdJwt, host = 'catswebapi.mcp.org', path = '/api/v1/token/introspect' }) {
  if (!token || !sdJwt) {
    return Promise.reject(new Error('Missing both token and sdJwt values.'));
  }

  const payload = new URLSearchParams({ token: sdJwt }).toString();

  const requestOptions = {
    hostname: host,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(payload),
      Authorization: `Bearer ${token}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (!data) {
          return resolve({ status: res.statusCode });
        }

        try {
          resolve(JSON.parse(data));
        } catch (err) {
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

if (require.main === module) {
  console.log('This file is intended as a code sample module.');
  console.log('Import validateSdJwt() from your application and call it with the postMessage-provided token and SD-JWT.');
}

module.exports = {
  validateSdJwt,
};
