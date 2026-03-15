precision highp float;

uniform sampler2D uTexture;
uniform sampler2D uNoise;
uniform float uTime;
uniform float uIntensity;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Sample noise texture for organic distortion
  vec3 noise = texture2D(uNoise, vUv + uTime * 0.5).rgb;
  
  // Create distortion offset based on intensity and noise
  vec2 distortion = (noise.rg - 0.5) * uIntensity * 0.15;
  
  // Add sine-based wave distortion for fluidity
  distortion += vec2(
    sin(vUv.y * 8.0 + uTime * 5.0) * uIntensity * 0.08,
    cos(vUv.x * 8.0 + uTime * 5.0) * uIntensity * 0.08
  );
  
  // Apply distortion to UV coordinates
  vec2 distortedUv = uv + distortion;
  
  // Sample the distorted texture
  vec4 color = texture2D(uTexture, distortedUv);
  
  // Optional: Add chromatic aberration for cinematic effect
  float chromaticIntensity = uIntensity * 0.03;
  float r = texture2D(uTexture, distortedUv + vec2(chromaticIntensity, 0.0)).r;
  float b = texture2D(uTexture, distortedUv - vec2(chromaticIntensity, 0.0)).b;
  
  color.r = mix(color.r, r, uIntensity * 0.5);
  color.b = mix(color.b, b, uIntensity * 0.5);
  
  gl_FragColor = color;
}
