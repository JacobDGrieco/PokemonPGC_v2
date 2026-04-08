import { json, methodNotAllowed } from '../_lib/response.js';
import { getSessionFromRequest, readJsonBody } from '../_lib/auth.js';
import { validateGameKey } from '../_lib/validation.js';
import { parseSaveForGame } from '../_lib/saveImport.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, ['POST']);
  }

  const session = getSessionFromRequest(req);
  if (!session?.userId) {
    return json(res, 401, { error: 'Not authenticated.' });
  }

  const parsedGameKey = validateGameKey(req.query?.gameKey);
  if (!parsedGameKey.ok) {
    return json(res, 400, { error: parsedGameKey.error });
  }

  const body = await readJsonBody(req);
  const contentBase64 = String(body?.contentBase64 || '').trim();

  if (!contentBase64) {
    return json(res, 400, { error: 'Missing save file data.' });
  }

  let buf;
  try {
    buf = Buffer.from(contentBase64, 'base64');
  } catch {
    return json(res, 400, { error: 'Invalid save file encoding.' });
  }

  if (!buf.length || buf.length > 1024 * 1024) {
    return json(res, 400, { error: 'Invalid save file size.' });
  }

  try {
    const result = parseSaveForGame(parsedGameKey.gameKey, buf);
    return json(res, 200, result);
  } catch (err) {
    console.error('[save-import] error:', err);
    return json(res, 400, {
      error: err?.message || 'Failed to parse save file.',
    });
  }
}
