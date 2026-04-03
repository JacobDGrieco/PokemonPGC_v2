import { json, methodNotAllowed } from '../_lib/response.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  return json(res, 501, {
    error: 'Save import is currently only available in the local Express backend. Deploying multipart parsing for the Vercel function is still pending.',
  });
}
