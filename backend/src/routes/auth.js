import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    icon: user.icon,
  };
}

router.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existing) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        icon: 'default',
      },
    });

    req.session.userId = user.id;
    return res.json(publicUser(user));
  } catch (error) {
    console.error('[auth/signup] error:', error);
    return res.status(500).json({ error: 'Internal error.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.userId = user.id;
    return res.json(publicUser(user));
  } catch (error) {
    console.error('[auth/login] error:', error);
    return res.status(500).json({ error: 'Internal error.' });
  }
});

router.post('/logout', (req, res) => {
  req.session = null;
  return res.json({ ok: true });
});

router.get('/me', async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.json({ user: null });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('[auth/me GET] error:', error);
    return res.status(500).json({ user: null });
  }
});

router.patch('/me', async (req, res) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        icon: req.body?.icon || undefined,
      },
    });

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error('[auth/me PATCH] error:', error);
    return res.status(500).json({ error: 'Internal error.' });
  }
});

export default router;
