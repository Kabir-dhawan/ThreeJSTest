import { useAnimations, useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

const MOVEMENT_SPEED = 0.032;
const ANIMATION_STATE = ["M_Standing_Idle_001", "M_Walk_001", "M_Dances_001"];
const BASE_URL = "https://kabir-dhawan.github.io/ThreeJSTest/";

export default function Model({
  id,
  avatarUrl = "https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb",
  animationState = 0,
  initialPosition = [0, 0, 0],
  ...props
}) {
  const group = useRef();
  const avatar = useRef();
  const [scale, setScale] = useState(0.5);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [isDragging, setIsDragging] = useState(false);

  const { scene } = useGLTF(avatarUrl);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const { animations: walkAnimation } = useGLTF(
    `${BASE_URL}/animations/${ANIMATION_STATE[1]}.glb`
  );
  const { animations: danceAnimation } = useGLTF(
    `${BASE_URL}/animations/${ANIMATION_STATE[2]}.glb`
  );
  const { animations: idleAnimation } = useGLTF(
    `${BASE_URL}/animations/${ANIMATION_STATE[0]}.glb`
  );

  const { actions } = useAnimations(
    [walkAnimation[0], idleAnimation[0], danceAnimation[0]],
    avatar
  );

  const [animation, setAnimation] = useState(ANIMATION_STATE[animationState]);   


  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone]);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();   

    return () => actions[animation]?.fadeOut(0.32);
  }, [animation, actions]);

  const handlePointerDown = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    // Calculate rotation based on pointer movement
    const { movementX } = e;
    setRotation((prevRotation) => [
      prevRotation[0],
      prevRotation[1] + movementX * 0.01,
      prevRotation[2],
    ]);

    // Optional: Scale based on vertical movement
    // const { movementY } = e;
    // setScale((prev) => Math.max(0.1, Math.min(prev - movementY * 0.001, 3)));
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <>
      <group
        ref={group}
        position={initialPosition}
        scale={scale}
        rotation={new THREE.Euler(...rotation)} // Use updated rotation state
        {...props}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <primitive object={clone} ref={avatar} />
      </group>
    </>
  );
}

// Preload animations for better performance
useGLTF.preload(`${BASE_URL}/animations/${ANIMATION_STATE[0]}.glb`);
useGLTF.preload(`${BASE_URL}/animations/${ANIMATION_STATE[1]}.glb`);
useGLTF.preload(`${BASE_URL}/animations/${ANIMATION_STATE[2]}.glb`);
