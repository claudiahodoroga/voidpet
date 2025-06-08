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

    // --- Configuración de la Escena de Three.js ---
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

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const clock = new THREE.Clock();
    let mixer: THREE.AnimationMixer | null = null;

    // --- Carga del Modelo GLTF ---
    const loader = new GLTFLoader();
    setIsLoading(true);
    setErrorLoading(null);

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // 1. Centrar el modelo en el origen del mundo
        model.position.sub(center);

        // 2. Ajuste de posición vertical
        // Ajusta este valor para mover el modelo arriba/abajo en la pantalla
        model.position.y -= size.y * 0.05;

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraDistance *= 2; // Ajusta este factor para el zoom

        camera.position.set(0, 1, cameraDistance); // Cámara a la altura del nuevo centro del modelo
        camera.lookAt(model.position); // Apuntar la cámara a la nueva posición del modelo

        scene.add(model);
        setIsLoading(false);
        if (onLoad) onLoad();

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (error) => {
        console.error("Ocurrió un error al cargar el modelo:", error);
        setErrorLoading(`Fallo al cargar el modelo: ${error.message}`);
        setIsLoading(false);
        if (onError) onError(error);
      }
    );

    // --- Bucle de Animación y Limpieza ---
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };

    // --- MEJORA: ResizeObserver para ajustar el canvas ---
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
