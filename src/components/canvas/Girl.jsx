import * as THREE from "three";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TransformControls, useGLTF, useHelper } from "@react-three/drei";
import { CCDIKSolver, CCDIKHelper } from "three/examples/jsm/animation/CCDIKSolver";
import { GUI } from "lil-gui";
import Stats from "stats.js";

const Scene = () => {
  const sceneRef = useRef();
  const cameraRef = useRef();
  const ikSolverRef = useRef(null);
  const [config, setConfig] = useState({
    followSphere: false,
    turnHead: true,
    ik_solver: true,
  });

  const { scene } = useGLTF("/models/gltf/kira.glb");
  const OOI = {};

  scene.traverse((n) => {
    if (n.name === "head") OOI.head = n;
    if (n.name === "lowerarm_l") OOI.lowerarm_l = n;
    if (n.name === "Upperarm_l") OOI.Upperarm_l = n;
    if (n.name === "hand_l") OOI.hand_l = n;
    if (n.name === "target_hand_l") OOI.target_hand_l = n;
    if (n.name === "boule") OOI.sphere = n;
    if (n.name === "Kira_Shirt_left") OOI.kira = n;
  });

  useEffect(() => {
    if (sceneRef.current) {
      const gui = new GUI();
      gui.add(config, "followSphere").name("Follow Sphere");
      gui.add(config, "turnHead").name("Turn Head");
      gui.add(config, "ik_solver").name("IK Auto Update");
      gui.open();
    }
  }, []);

  useFrame(() => {
    if (config.ik_solver && ikSolverRef.current) {
      ikSolverRef.current.update();
    }
  });

  return (
    <>
      <ambientLight intensity={2} />
      <OrbitControls />
      <primitive object={scene} />
      {OOI.target_hand_l && <TransformControls object={OOI.target_hand_l} />}
    </>
  );
};

const Girl = () => {
  return (
    <Canvas camera={{ position: [1, 1, 1], fov: 55 }}>
      <Scene />
    </Canvas>
  );
};

export default Girl;
