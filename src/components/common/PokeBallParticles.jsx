import React, { useMemo } from "react";

// Ball colors matching the CSS in auth.css
const BALL_STYLES = {
	poke: {
		background:
			"radial-gradient(circle at 32% 32%, #fff 0, #fff 34%, #e31c23 35%, #e31c23 78%, #111 79%)",
	},
	great: {
		background:
			"radial-gradient(circle at 32% 32%, #fff 0, #fff 34%, #3b5dc9 35%, #3b5dc9 78%, #111 79%)",
	},
	ultra: {
		background:
			"radial-gradient(circle at 32% 32%, #fff 0, #fff 34%, #f5c644 35%, #2a2925 78%, #111 79%)",
	},
	master: {
		background:
			"radial-gradient(circle at 32% 32%, #fff 0, #fff 34%, #9b5fb5 35%, #9b5fb5 78%, #111 79%)",
	},
};

const BALL_KEYS = Object.keys(BALL_STYLES);

// Seeded PRNG so positions are stable across renders
function seededRand(seed) {
	let s = seed;
	return () => {
		s = (s * 16807) % 2147483647;
		return (s - 1) / 2147483646;
	};
}

export function PokeBallParticles({ count = 22 }) {
	const balls = useMemo(() => {
		const rand = seededRand(1337);
		return Array.from({ length: count }, (_, i) => ({
			id: i,
			type: BALL_KEYS[Math.floor(rand() * BALL_KEYS.length)],
			size: Math.round(7 + rand() * 16),
			left: rand() * 96 + 2,
			delay: rand() * 12,
			duration: Math.round(16 + rand() * 12),
			drift: Math.round((rand() - 0.5) * 70),
			opacity: parseFloat((0.15 + rand() * 0.22).toFixed(2)),
		}));
	}, [count]);

	return (
		<div className="pokeball-particles" aria-hidden="true">
			{balls.map((ball) => (
				<div
					key={ball.id}
					className="pokeball-particle"
					style={{
						...BALL_STYLES[ball.type],
						width: ball.size,
						height: ball.size,
						left: `${ball.left}%`,
						"--particle-opacity": ball.opacity,
						animationDelay: `${ball.delay}s`,
						animationDuration: `${ball.duration}s`,
						"--drift": `${ball.drift}px`,
					}}
				/>
			))}
		</div>
	);
}
