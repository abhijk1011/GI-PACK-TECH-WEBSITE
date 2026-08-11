'use strict';

/*
 * Netlify Function entry point.
 *
 * Every request that is not a static file in `public/` is routed here by the
 * catch-all redirect in netlify.toml, and handed to the Express app.
 */

const serverless = require('serverless-http');
const app = require('../../server');

const handler = serverless(app, {
  binary: ['image/*', 'application/octet-stream'],
});

exports.handler = async (event, context) => {
  // Let the response return without waiting for the Postgres pool to drain.
  context.callbackWaitsForEmptyEventLoop = false;
  return handler(event, context);
};
