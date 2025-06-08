// src/components/ThreeJSPet/ThreeJSPetModel.tsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ThreeJSPetModelProps {
  modelPath: string;
  onLoad?: () => void;
  onError?: (error: ErrorEvent) => void;
}

const ThreeJSPetModel: React.FC<ThreeJSPetModelProps> = ({
  modelPath,
  onLoad,
  onError,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;
    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer;
    let modelScene: THREE.Group | null = null;

    // Escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    currentMount.appendChild(renderer.domElement);

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const clock = new THREE.Clock();
    let mixer: THREE.AnimationMixer | null = null;

    // Cargar modelo
    const loader = new GLTFLoader();
    setIsLoading(true);
    setErrorLoading(null);

    loader.load(
      modelPath,
      (gltf) => {
        modelScene = gltf.scene;
        const box = new THREE.Box3().setFromObject(modelScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        modelScene.position.sub(center);
        modelScene.position.y = -1.5; // Ajuste de posición vertical

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraDistance *= 2.2;

        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);

        scene.add(modelScene);

        setIsLoading(false);
        if (onLoad) onLoad();

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(modelScene);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model:", error);
        setErrorLoading(`Failed to load model: ${error.message}`);
        setIsLoading(false);
        if (onError) onError(error);
      }
    );

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      // Rotación del modelo
      if (modelScene) {
        modelScene.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    resizeObserver.observe(currentMount);
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material as THREE.Material | THREE.Material[];
          if (Array.isArray(material)) {
            material.forEach((mat) => mat.dispose());
          } else if (material) {
            material.dispose();
          }
        }
      });
      renderer.dispose();
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, onLoad, onError]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            background: "rgba(0,0,0,0.5)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          Cargando Modelo 3D...
        </div>
      )}
      {errorLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#ffbaba",
            padding: "10px",
            background: "rgba(90,0,0,0.7)",
            borderRadius: "5px",
            border: "1px solid red",
          }}
        >
          Error: {errorLoading}
        </div>
      )}
    </div>
  );
};

export default ThreeJSPetModel;
