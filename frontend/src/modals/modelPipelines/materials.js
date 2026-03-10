import * as THREE from "three";

export function makePokemonEyeMaterial({
	name = "eye",
	alb,
	lym,
	msk,
	irisTex,
	irisColor,
	pupilColor,
	pupilCenter = { x: 0.5, y: 0.5 },
	pupilRadius = 0.18,
	pupilFeather = 0.04,
}) {
	const mat = new THREE.ShaderMaterial({
		name,
		transparent: true,
		depthWrite: false,
		lights: false,
		uniforms: {
			uAlb: { value: alb || null },
			uHasAlb: { value: !!alb },
			uScleraFallback: { value: new THREE.Color(1, 1, 1) },

			uLym: { value: lym || null },
			uHasLym: { value: !!lym },

			uMsk: { value: msk || null },
			uHasMsk: { value: !!msk },

			uIrisTex: { value: irisTex || null },
			uHasIrisTex: { value: !!irisTex },

			uIrisColor: { value: irisColor || new THREE.Color(0.2, 0.8, 0.2) },
			uPupilColor: { value: pupilColor || new THREE.Color(0, 0, 0) },

			uPupilCenter: { value: new THREE.Vector2(pupilCenter.x, pupilCenter.y) },
			uPupilRadius: { value: pupilRadius },
			uPupilFeather: { value: pupilFeather },

			// lighting (driven from tick)
			uAmb: { value: new THREE.Color(0xffffff) },
			uAmbIntensity: { value: 1.0 },

			uHemiSky: { value: new THREE.Color(0xffffff) },
			uHemiGround: { value: new THREE.Color(0x333333) },
			uHemiIntensity: { value: 0.0 },
			uHemiDir: { value: new THREE.Vector3(0, 1, 0) },

			uDir0Color: { value: new THREE.Color(0xffffff) },
			uDir0Intensity: { value: 0.0 },
			uDir0Dir: { value: new THREE.Vector3(0, -1, 0) },

			uDir1Color: { value: new THREE.Color(0xffffff) },
			uDir1Intensity: { value: 0.0 },
			uDir1Dir: { value: new THREE.Vector3(0, -1, 0) },

			uSpecPower: { value: 80.0 },
			uSpecStrength: { value: 0.9 },
			uLymBoost: { value: 1.0 },

			uMatOverlayColor: { value: new THREE.Color(1, 1, 1) },
			uMatOverlayStrength: { value: 0.0 },
			uMeshOverlayColor: { value: new THREE.Color(1, 1, 1) },
			uMeshOverlayStrength: { value: 0.0 },
		},
		vertexShader: `
			varying vec2 vUv;
			varying vec3 vN;
			varying vec3 vV;

			#include <common>
			#include <uv_pars_vertex>
			#include <skinning_pars_vertex>
			#include <normal_pars_vertex>

			void main() {
				#include <uv_vertex>

				#include <beginnormal_vertex>
				#include <skinbase_vertex>
				#include <skinnormal_vertex>
				#include <defaultnormal_vertex>

				#include <begin_vertex>
				#include <skinning_vertex>

				vec4 mvPos = modelViewMatrix * vec4(transformed, 1.0);
				gl_Position = projectionMatrix * mvPos;

				vUv = uv;
				vN = normalize(normalMatrix * objectNormal);
				vV = normalize(-mvPos.xyz);
			}
		`,
		fragmentShader: `
			precision highp float;

			varying vec2 vUv;
			varying vec3 vN;
			varying vec3 vV;

			uniform sampler2D uAlb;
			uniform bool uHasAlb;
			uniform vec3 uScleraFallback;

			uniform vec2 uPupilCenter;
			uniform float uPupilRadius;
			uniform float uPupilFeather;

			uniform sampler2D uLym;
			uniform bool uHasLym;

			uniform vec3 uIrisColor;
			uniform vec3 uPupilColor;

			uniform vec3 uAmb;
			uniform float uAmbIntensity;

			uniform vec3 uMatOverlayColor;
			uniform float uMatOverlayStrength;
			uniform vec3 uMeshOverlayColor;
			uniform float uMeshOverlayStrength;

			void main() {
				vec3 base = uHasAlb ? texture2D(uAlb, vUv).rgb : uScleraFallback;

				// Simple lighting (ambient only) – eyes in SV are mostly “unlit”
				vec3 lit = uAmb * uAmbIntensity;

				// Default masks if LYM is missing
				float irisMask  = 0.0;
				float rimMask   = 0.0;
				float pupilMask = 0.0;

				if (uHasLym) {
					vec4 lym = texture2D(uLym, vUv);

					// These are your current assumptions:
					//  g = iris region, b = rim/outline, a = pupil-ish
					irisMask  = clamp(lym.g, 0.0, 1.0);
					rimMask   = clamp(lym.b, 0.0, 1.0);
					pupilMask = clamp(lym.a, 0.0, 1.0);

					// Make pupil more binary so it doesn’t look “smoky”
					pupilMask = smoothstep(0.25, 0.45, pupilMask);

					// Don’t let rim exist outside iris (keeps outline sane)
					rimMask *= irisMask;

					// Pupil wins over everything
					irisMask *= (1.0 - pupilMask);
					rimMask  *= (1.0 - pupilMask);
				} else {
					// Procedural fallback (when there's no LYM mask):
					// Create a pupil circle + iris circle around uPupilCenter.
					float d = distance(vUv, uPupilCenter);

					// Pupil is a soft circle
					pupilMask = 1.0 - smoothstep(uPupilRadius - uPupilFeather, uPupilRadius + uPupilFeather, d);

					// Iris is a larger circle around pupil
					float irisR = uPupilRadius * 2.25;
					float irisFeather = uPupilFeather * 1.5;
					float irisCircle = 1.0 - smoothstep(irisR - irisFeather, irisR + irisFeather, d);

					// iris excludes pupil
					irisMask = clamp(irisCircle - pupilMask, 0.0, 1.0);

					// Rim is a thin ring at the iris edge
					float rimInner = irisR * 0.92;
					float rimOuter = irisR * 1.02;
					float rim = smoothstep(rimInner - irisFeather, rimInner + irisFeather, d)
								- smoothstep(rimOuter - irisFeather, rimOuter + irisFeather, d);
					rimMask = clamp(rim, 0.0, 1.0);

					// Keep rim inside iris, pupil wins
					rimMask *= irisMask;
					irisMask *= (1.0 - pupilMask);
					rimMask  *= (1.0 - pupilMask);
				}

				float scleraMask = clamp(1.0 - (irisMask + rimMask + pupilMask), 0.0, 1.0);

				// IMPORTANT: alpha includes pupil, otherwise pupils go transparent
				float alpha = clamp(scleraMask + irisMask + rimMask + pupilMask, 0.0, 1.0);
				if (alpha <= 0.01) discard;

				vec3 scleraCol = base * lit;                 // lit
				vec3 irisCol   = uIrisColor;                 // unlit
				vec3 pupilCol  = uPupilColor;                // unlit
				vec3 rimCol    = mix(uIrisColor, vec3(0.0), 0.55); // darker outline

				vec3 col =
				scleraCol * scleraMask +
				irisCol   * irisMask +
				pupilCol  * pupilMask +
				rimCol    * rimMask;

				// overlay tint
				col = mix(col, col * uMatOverlayColor,  uMatOverlayStrength);
				col = mix(col, col * uMeshOverlayColor, uMeshOverlayStrength);

				gl_FragColor = vec4(col, alpha);
			}
		`,
	});

	mat.skinning = true;
	if (alb) alb.flipY = false;
	if (lym) lym.flipY = false;

	return mat;
}

export function makePokemonBodyMaterial({
	name,
	alb,
	nrm,
	rgn,
	mtl,
	ao,
	emi,
	lym = null,
	tintA = null,
	tintB = null,
}) {
	const mat = new THREE.MeshStandardMaterial({
		name,
		map: alb || null,
		normalMap: nrm || null,

		roughness: 0.92,          // was 0.8
		metalness: 0.0,

		aoMap: ao || null,
		aoMapIntensity: 1.0,
	});
	if (mat.normalMap) mat.normalScale.set(0.65, 0.65);
	mat.envMapIntensity = 0.35;
	mat.skinning = true;

	// --- unified shader injection (SV-ish + optional LA tint) ---
	mat.onBeforeCompile = (shader) => {
		// Base SV-ish uniforms
		shader.uniforms.uRgn = { value: rgn || null };
		shader.uniforms.uMtl = { value: mtl || null };
		shader.uniforms.uEmi = { value: emi || null };
		shader.uniforms.uHasRgn = { value: !!rgn };
		shader.uniforms.uHasMtl = { value: !!mtl };
		shader.uniforms.uHasEmi = { value: !!emi };

		// Toon controls
		shader.uniforms.uToonSteps = { value: 4.0 };
		shader.uniforms.uToonStrength = { value: 0.55 };
		shader.uniforms.uSpecBoost = { value: 0.8 };
		shader.uniforms.uSatBoost = { value: 1.05 };
		shader.uniforms.uValBoost = { value: 1.05 };

		// ✅ Optional LA two-tone uniforms
		const hasLymTint = !!(lym && tintA && tintB);
		shader.uniforms.uHasLymTint = { value: hasLymTint };
		shader.uniforms.uLym = { value: lym || null };
		shader.uniforms.uTintA = { value: tintA || new THREE.Color(1, 1, 1) };
		shader.uniforms.uTintB = { value: tintB || new THREE.Color(1, 1, 1) };

		shader.vertexShader =
			`
varying vec2 ppgcUv;
` + shader.vertexShader;

		shader.vertexShader = shader.vertexShader.replace(
			"#include <uv_vertex>",
			`
#include <uv_vertex>
ppgcUv = uv;
`
		);

		shader.fragmentShader =
			`
varying vec2 ppgcUv;

uniform sampler2D uRgn;
uniform sampler2D uMtl;
uniform sampler2D uEmi;
uniform bool uHasRgn;
uniform bool uHasMtl;
uniform bool uHasEmi;

uniform float uToonSteps;
uniform float uToonStrength;
uniform float uSpecBoost;
uniform float uSatBoost;
uniform float uValBoost;

// LA tint
uniform bool uHasLymTint;
uniform sampler2D uLym;
uniform vec3 uTintA;
uniform vec3 uTintB;

vec3 rgb2hsv(vec3 c){
	vec4 K = vec4(0., -1./3., 2./3., -1.);
	vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
	vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
	float d = q.x - min(q.w, q.y);
	float e = 1e-10;
	return vec3(abs(q.z + (q.w - q.y) / (6. * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c){
	vec3 p = abs(fract(c.xxx + vec3(0., 2./3., 1./3.)) * 6. - 3.);
	return c.z * mix(vec3(1.), clamp(p - 1., 0., 1.), c.y);
}
` + shader.fragmentShader;

		// 1) Color fragment boost + optional LA tint
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <color_fragment>",
			`
#include <color_fragment>

// Optional LA two-tone tint using LYM.r as mask
if (uHasLymTint) {
	float mask = texture2D(uLym, ppgcUv).r;
	vec3 tint = mix(uTintA, uTintB, mask);
	diffuseColor.rgb *= tint;
}

// mild saturation/value boost
vec3 hsv = rgb2hsv( diffuseColor.rgb );
hsv.y *= uSatBoost;
hsv.z *= uValBoost;
diffuseColor.rgb = hsv2rgb(hsv);
`
		);

		// 2) Roughness decode
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <roughnessmap_fragment>",
			`
float roughnessFactor = roughness;

if (uHasRgn) {
	vec4 rg = texture2D(uRgn, ppgcUv);
	roughnessFactor *= clamp(rg.g, 0.02, 1.0);
}

roughnessFactor = clamp(roughnessFactor, 0.02, 1.0);
`
		);

		// 3) Metalness decode
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <metalnessmap_fragment>",
			`
float metalnessFactor = metalness;

if (uHasMtl) {
	vec4 mt = texture2D(uMtl, ppgcUv);
	metalnessFactor = clamp(mt.r, 0.0, 1.0);
}
`
		);

		// 4) Optional emissive
		shader.fragmentShader = shader.fragmentShader.replace(
			"#include <emissivemap_fragment>",
			`
#include <emissivemap_fragment>
if (uHasEmi) {
	vec3 e = texture2D(uEmi, ppgcUv).rgb;
	totalEmissiveRadiance += e * uSpecBoost;
}
`
		);

		// 5) Final toon-ish quantization
		shader.fragmentShader = shader.fragmentShader.replace(
			"gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
			`
vec3 col = outgoingLight;

// Simple toon-ish quantization based on luminance
float steps = max(uToonSteps, 1.0);
float lum = dot(col, vec3(0.299, 0.587, 0.114));
float q = floor(lum * steps) / steps;

float mixAmt = clamp(uToonStrength, 0.0, 1.0);
float scale = (lum > 1e-5) ? (q / lum) : 1.0;

col = mix(col, col * scale, mixAmt);

gl_FragColor = vec4(col, diffuseColor.a);
`
		);

		mat.userData._ppgcShader = shader;
	};

	mat.needsUpdate = true;
	return mat;
}

export function makePokemonSmokeMaterial({
	name = "smoke",
	msk,
	noise,
	tint = new THREE.Color(1, 1, 1),
	speed = 0.08,
	noiseScale = 3.0,
	alphaCut = 0.02,
	blending = THREE.NormalBlending, // more “smoke”, less “glow”
}) {
	const mat = new THREE.ShaderMaterial({
		name,
		transparent: true,
		depthWrite: false,
		depthTest: true,
		blending,
		side: THREE.DoubleSide,
		skinning: true,
		uniforms: {
			uMask: { value: msk || null },
			uHasMask: { value: !!msk },

			uNoise: { value: noise || null },
			uHasNoise: { value: !!noise },

			uTint: { value: tint.clone() },
			uTime: { value: 0 },
			uSpeed: { value: speed },
			uNoiseScale: { value: noiseScale },
			uAlphaCut: { value: alphaCut },
		},
		vertexShader: `
    varying vec2 vUv;

    #include <common>
    #include <uv_pars_vertex>
    #include <skinning_pars_vertex>

    void main() {
      #include <uv_vertex>

      // standard skinned vertex transform path
      #include <begin_vertex>
      #include <skinbase_vertex>
      #include <skinning_vertex>

      vec4 mvPos = modelViewMatrix * vec4(transformed, 1.0);
      gl_Position = projectionMatrix * mvPos;

      vUv = uv;
    }
  `,
		fragmentShader: `
      varying vec2 vUv;

      uniform sampler2D uMask;
      uniform bool uHasMask;

      uniform sampler2D uNoise;
      uniform bool uHasNoise;

      uniform vec3  uTint;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uNoiseScale;
      uniform float uAlphaCut;

      float sat(float x){ return clamp(x, 0.0, 1.0); }

      void main() {
        // 1) Base shape alpha from mask (prefer R)
        float a = 1.0;
        if (uHasMask) {
          a = texture2D(uMask, vUv).r;
        }

        // 2) Two-layer animated noise (use ONE channel only; these are packed/data)
        float n1 = 1.0;
        float n2 = 1.0;

        if (uHasNoise) {
          vec2 uv1 = vUv * uNoiseScale + vec2( uTime * uSpeed, -uTime * uSpeed * 0.73);
          vec2 uv2 = vUv * (uNoiseScale * 1.85) + vec2(-uTime * uSpeed * 0.41,  uTime * uSpeed * 1.12);

          n1 = texture2D(uNoise, uv1).r;
          n2 = texture2D(uNoise, uv2).r;
        }

        // 3) Soft edge fade to avoid “perfect sphere” look
        vec2 p = vUv - vec2(0.5);
        float r = length(p) * 2.0;                // ~0 center, ~1 edges
        float edge = 1.0 - smoothstep(0.70, 1.05, r);

        // 4) Compose final alpha: mask * noisy breakup * edge softness
        float noiseMix = smoothstep(0.20, 1.0, n1) * smoothstep(0.25, 1.0, n2);
        float alpha = a * noiseMix * edge;

        if (alpha < uAlphaCut) discard;

        gl_FragColor = vec4(uTint, alpha);
      }
    `,
	});

	mat.userData.ppgcSmoke = true;
	return mat;
}