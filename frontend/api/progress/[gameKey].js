import { json, methodNotAllowed } from '../_lib/response.js';
import { getSessionFromRequest, readJsonBody } from '../_lib/auth.js';
import { prisma } from '../_lib/db.js';
import { validateGameKey, validateSnapshotPayload } from '../_lib/validation.js';

export default async function handler(req, res) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'PUT') return handlePut(req, res);
  return methodNotAllowed(res, ['GET', 'PUT']);
}

async function handleGet(req, res) {
  const session = getSessionFromRequest(req);
  const parsedGameKey = validateGameKey(req.query?.gameKey);

  if (!session?.userId) {
    return json(res, 401, { error: 'Not authenticated.' });
  }

  if (!parsedGameKey.ok) {
    return json(res, 400, { error: parsedGameKey.error });
  }

  try {
    const save = await prisma.gameSave.findUnique({
      where: {
        userId_gameKey: {
          userId: session.userId,
          gameKey: parsedGameKey.gameKey,
        },
      },
    });

    if (!save) {
      return json(res, 404, { save: null });
    }

    return json(res, 200, {
      save: {
        gameKey: save.gameKey,
        data: save.data,
        updatedAt: save.updatedAt,
      },
    });
  } catch (error) {
    console.error('[progress GET by game] error:', error);
    return json(res, 500, { error: 'Internal error.' });
  }
}

async function handlePut(req, res) {
  const session = getSessionFromRequest(req);
  const parsedGameKey = validateGameKey(req.query?.gameKey);

  if (!session?.userId) {
    return json(res, 401, { error: 'Not authenticated.' });
  }

  if (!parsedGameKey.ok) {
    return json(res, 400, { error: parsedGameKey.error });
  }

  const body = await readJsonBody(req);
  const data = body?.data ?? body?.snapshot ?? null;
  const parsedData = validateSnapshotPayload(data);

  if (!parsedData.ok) {
    return json(res, 400, { error: parsedData.error });
  }

  try {
    const save = await prisma.gameSave.upsert({
      where: {
        userId_gameKey: {
          userId: session.userId,
          gameKey: parsedGameKey.gameKey,
        },
      },
      update: {
        data: parsedData.data,
        updatedAt: new Date(),
      },
      create: {
        userId: session.userId,
        gameKey: parsedGameKey.gameKey,
        data: parsedData.data,
      },
    });

    return json(res, 200, { ok: true, save });
  } catch (error) {
    console.error('[progress PUT by game] error:', error);
    return json(res, 500, { error: 'Internal error.' });
  }
}
