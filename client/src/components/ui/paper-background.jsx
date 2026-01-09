import { MeshGradient, DotOrbit } from "@paper-design/shaders-react"

export default function PaperBackground({ effect = "mesh", speed = 1, intensity = 1.5 }) {
  return (
    <div className="absolute inset-0 z-0">
      {effect === "mesh" && (
        <MeshGradient
          className="w-full h-full"
          colors={["#000000", "#111111", "#333333", "#ffffff"]}
          speed={speed}
          backgroundColor="#000000"
        />
      )}

      {effect === "dots" && (
        <DotOrbit
          className="w-full h-full"
          dotColor="#333333"
          orbitColor="#1a1a1a"
          speed={speed}
          intensity={intensity}
        />
      )}

      {effect === "combined" && (
        <>
          <MeshGradient
            className="w-full h-full"
            colors={["#000000", "#111111", "#333333", "#ffffff"]}
            speed={speed * 0.6}
            backgroundColor="#000000"
          />
          <div className="absolute inset-0 opacity-60">
            <DotOrbit speed={speed * 1.5} intensity={intensity * 0.8} />
          </div>
        </>
      )}
    </div>
  )
}
