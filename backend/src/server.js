import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import cookieSession from "cookie-session";

import authRouter from "./routes/auth.js";
import healthRouter from "./routes/health.js";
import progressRouter from "./routes/progress.js";
import saveImportRouter from "./routes/saveImport.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// CORS: allow your frontend; in dev you can just allow same-origin
app.use(
	cors({
		origin: true,          // reflect request origin
		credentials: true,     // allow cookies
	})
);

// Simple cookie-based session (for login)
app.use(
	cookieSession({
		name: "ppgc_session",
		secret: process.env.SESSION_SECRET || "dev-secret-change-me",
		httpOnly: true,
		sameSite: "lax",
		secure: false // set true when using HTTPS
	})
);

// --- API routes ---
app.use("/api/auth", authRouter);
app.use("/api/health", healthRouter);
app.use("/api/progress", progressRouter);
app.use("/api/save-import", saveImportRouter);

// --- Static frontend ---
// Serve the frontend folder as static files
const frontendDir = path.join(__dirname, "..", "..", "frontend");
app.use(express.static(frontendDir));

// Fallback: send index.html for anything not /api/*
// Helpful if you later want "single page" behavior
app.get("*", (req, res) => {
	res.sendFile(path.join(frontendDir, "index.html"));
});

app.listen(PORT, () => {
	console.log(`PPGC server listening on http://localhost:${PORT}`);
});