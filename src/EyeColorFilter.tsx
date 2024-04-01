import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

const EyeColorFilter = ({ color, eye }) => {
  const { gl, scene, camera } = useThree()
  const meshRef = useRef()

  useEffect(() => {
    // This effect adjusts the layer the mesh is on based on the eye.
    // It's a speculative approach that relies on the concept of using layers to differentiate eyes.
    // Note: This specific technique won't work as intended for eye-specific filters in WebXR.
    const layer = eye === 'left' ? 1 : 2
    if (meshRef.current) {
      meshRef.current.layers.set(layer)
    }
  }, [eye])

  useFrame(({ gl, camera }) => {
    // Attempt to adjust rendering per frame. This is speculative and does not directly apply to WebXR eye-specific rendering.
    // The intention here is to show how you might try to dynamically adjust properties per frame.
    // In WebXR, the rendering to each eye is managed at a lower level not exposed through these high-level APIs.
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -1]} scale={[2, 2, 2]}>
      <boxGeometry />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  )
}
