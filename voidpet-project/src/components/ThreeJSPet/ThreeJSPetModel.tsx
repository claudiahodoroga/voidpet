// src/components/ThreeJSPetModel/ThreeJSPetModel.tsx
import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface ThreeJSPetModelProps {
  // El tipo de modelPath debe ser 'string' para aceptar cualquier ruta.
  modelPath: string;
  onLoad?: () => void;
  onError?: (error: ErrorEvent) => void;
  // animationName?: string; // Prop futura para controlar animaciones
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

    // --- Configuración de la Escena de Three.js ---

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // CORRECCIÓN PARA TEXTURAS/COLORES: Esta línea es crucial para que los colores se vean correctamente.
    // Asegura que los colores del modelo se rendericen en el espacio de color correcto (sRGB).
    renderer.outputEncoding = THREE.sRGBEncoding;
    currentMount.appendChild(renderer.domElement);

    // CORRECCIÓN DE ILUMINACIÓN: Reducimos un poco la intensidad para evitar que los colores se "quemen" o se vean blancos.
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // Reducido de 0.9
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Reducido de 1.2
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
        model.position.sub(center); // Centrar el pivote del modelo en el origen

        // CORRECCIÓN DE POSICIÓN: Movemos el modelo un poco hacia abajo en el eje Y.
        // Un valor negativo lo bajará. Puedes ajustar -0.1 a -0.15, -0.2, etc., para bajarlo más.
        model.position.y -= size.y * 0.1;

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraDistance *= 2.0;

        camera.position.set(0, size.y * 0.4, cameraDistance); // La posición Y de la cámara puede necesitar pequeños ajustes
        camera.lookAt(model.position); // La cámara ahora apunta a la nueva posición del modelo (ligeramente más abajo)

        scene.add(model);
        setIsLoading(false);
        if (onLoad) onLoad();
        console.log("Modelo 3D cargado exitosamente.");

        if (gltf.animations && gltf.animations.length) {
          console.log(
            `Encontradas ${gltf.animations.length} animaciones. Reproduciendo la primera: "${gltf.animations[0].name}".`
          );
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        } else {
          console.log("El modelo no contiene animaciones.");
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

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      console.log("ThreeJSPetModel desmontado y limpiado.");
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
      {/* El lienzo de Three.js se adjuntará aquí */}
    </div>
  );
};

export default ThreeJSPetModel;
