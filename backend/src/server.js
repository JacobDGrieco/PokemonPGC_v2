import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieSession from 'cookie-session';

import authRouter from './routes/auth.js';
import healthRouter from './routes/health.js';
import progressRouter from './routes/progress.js';
import saveImportRouter from './routes/saveImport.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || process.env.BACKEND_PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';
const frontendDistDir = path.join(__dirname, '..', '..', 'frontend', 'dist');

app.use(express.json({ limit: '5mb' }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  cookieSession({
    name: 'ppgc_session',
    secret: process.env.SESSION_SECRET || process.env.AUTH_SECRET || 'dev-secret-change-me',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  })
);

app.use('/api/auth', authRouter);
app.use('/api/health', healthRouter);
app.use('/api/progress', progressRouter);
app.use('/api/save-import', saveImportRouter);

if (isProd) {
  app.use(express.static(frontendDistDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendDistDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`PPGC backend listening on http://localhost:${PORT}`);
});
