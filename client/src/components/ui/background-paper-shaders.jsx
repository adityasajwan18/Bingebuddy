import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

function ShaderPlane({ position, color1, color2 }) {
  const mesh = useRef()

  // 🔥 uniforms must be mutable → useRef
  const uniforms = useRef({
    time: { value: 0 },
    intensity: { value: 1 },
    color1: { value: new THREE.Color(color1) },
    color2: { value: new THREE.Color(color2) },
  })

  useFrame((state) => {
    uniforms.current.time.value = state.clock.elapsedTime
    uniforms.current.intensity.value =
      1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
  })

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[3, 3, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float time;
          uniform float intensity;
          varying vec2 vUv;

          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.y += sin(pos.x * 10.0 + time) * 0.15 * intensity;
            pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.1 * intensity;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;

          void main() {
            float n = sin(vUv.x * 20.0 + time) * cos(vUv.y * 15.0 + time);
            vec3 color = mix(color1, color2, n * 0.5 + 0.5);
            float glow = 1.0 - length(vUv - 0.5) * 2.0;
            glow = pow(glow, 2.0);
            gl_FragColor = vec4(color * glow, glow);
          }
        `}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function BackgroundPaperShaders() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <ambientLight intensity={1} />
        <ShaderPlane position={[0, 0, 0]} color1="#ff5722" color2="#ffffff" />
      </Canvas>
    </div>
  )
}
