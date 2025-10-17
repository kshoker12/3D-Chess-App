import { ChessProvider } from './context/ChessContext';
import AppCanvas from './AppCanvas';
import { LoadChessTeam } from './utils/ChessHelper';

function App() {
  const teams = [LoadChessTeam("white"), LoadChessTeam("black")]

  return (
    <ChessProvider teams = {teams}>
      <AppCanvas/>
    </ChessProvider>
  )
}

export default App

// import React, { useState, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// function ComplexScene() {
//   // This scene contains multiple objects with different geometries and materials.
//   return (
//     <group>
//       <mesh position={[-2, 0, 0]}>
//         <sphereGeometry args={[1, 32, 32]} />
//         <meshStandardMaterial color="lightblue" metalness={0.3} roughness={0.4} />
//       </mesh>
//       <mesh position={[2, 0, 0]}>
//         <boxGeometry args={[2, 2, 2]} />
//         <meshStandardMaterial color="pink" />
//       </mesh>
//       <mesh position={[0, 0, -2]}>
//         <cylinderGeometry args={[1, 1, 2, 32]} />
//         <meshStandardMaterial color="green" />
//       </mesh>
//       <mesh position={[0, -2, 2]}>
//         <torusGeometry args={[0.5, 0.2, 16, 100]} />
//         <meshStandardMaterial color="orange" />
//       </mesh>
//       <mesh position={[0, 2, 2]}>
//         <coneGeometry args={[1, 2, 32]} />
//         <meshStandardMaterial color="purple" />
//       </mesh>
//     </group>
//   );
// }

// function generatePreview(position, target, callback) {
//   const tempCanvas = document.createElement('canvas');
//   tempCanvas.width = 200;  // Preview size
//   tempCanvas.height = 200;
//   const renderer = new THREE.WebGLRenderer({ canvas: tempCanvas });
//   const camera = new THREE.PerspectiveCamera(50, tempCanvas.width / tempCanvas.height, 0.1, 1000);
//   camera.position.set(...position);
//   camera.lookAt(new THREE.Vector3(...target));

//   // Setup the scene for the preview
//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xeeeeee);  // Set a light background color
//   scene.add(new THREE.AmbientLight(0xffffff, 0.8));  // Ambient light

//   // Add complex objects
//   const materials = {
//     sphere: new THREE.MeshStandardMaterial({ color: "lightblue", metalness: 0.3, roughness: 0.4 }),
//     box: new THREE.MeshStandardMaterial({ color: "pink" }),
//     cylinder: new THREE.MeshStandardMaterial({ color: "green" }),
//     torus: new THREE.MeshStandardMaterial({ color: "orange" }),
//     cone: new THREE.MeshStandardMaterial({ color: "purple" })
//   };

//   // Create and add geometries
//   const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), materials.sphere);
//   sphere.position.set(-2, 0, 0);
//   scene.add(sphere);

//   const box = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), materials.box);
//   box.position.set(2, 0, 0);
//   scene.add(box);

//   const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 32), materials.cylinder);
//   cylinder.position.set(0, 0, -2);
//   scene.add(cylinder);

//   const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 16, 100), materials.torus);
//   torus.position.set(0, -2, 2);
//   scene.add(torus);

//   const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), materials.cone);
//   cone.position.set(0, 2, 2);
//   scene.add(cone);

//   // Setup lighting
//   const pointLight = new THREE.PointLight(0xffffff, 1, 100);
//   pointLight.position.set(10, 10, 10);
//   scene.add(pointLight);

//   // Render the scene with the given camera and output the result
//   renderer.render(scene, camera);
//   callback(tempCanvas.toDataURL());

//   // Cleanup
//   renderer.dispose();
// }


// function CameraController({ setView, previews }) {
//   return (
//     <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
//       {previews.map((preview, index) => (
//         <button key={index} onClick={() => setView(preview.config)} style={{ background: `url(${preview.image}) no-repeat center center`, backgroundSize: 'contain', border: 'none', width: '100px', height: '100px' }}>
//           {/* No text needed */}
//         </button>
//       ))}
//     </div>
//   );
// }

// function App() {
//   const [view, setView] = useState({ position: [5, 5, 5], target: [0, 0, 0] });
//   const [previews, setPreviews] = useState([]);

//   useEffect(() => {
//     const views = [
//       { position: [5, 5, 5], target: [0, 0, 0] }, // Axonometric
//       { position: [0, 10, 0], target: [0, 0, 0] }, // Top-Down
//       { position: [10, 0, 0], target: [0, 0, 0] }, // Side 1
//       { position: [-10, 0, 0], target: [0, 0, 0] } // Side 2
//     ];

//     setPreviews([]); // Clear existing previews before generating new ones
//     views.forEach((view, index) => {
//       generatePreview(view.position, view.target, (image) => {
//         setPreviews(prev => [...prev, { config: view, image }]);
//       });
//     });
//   }, []);

//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <Canvas>
//         <PerspectiveCamera makeDefault position={view.position} fov={50} />
//         <OrbitControls target={new THREE.Vector3(...view.target)} />
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} />
//         <ComplexScene />
//       </Canvas>
//       <CameraController setView={setView} previews={previews} />
//     </div>
//   );
// }

// export default App;


// import React, { useRef, useState } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// function MeshRow() {
//     const [meshes, setMeshes] = useState([]);
//     const [scrollPos, setScrollPos] = useState(0);

//     // Function to add a new mesh to the scene
//     const addMesh = (xPosition) => {
//         setMeshes(prevMeshes => [...prevMeshes, { x: xPosition }]);
//     };

//     // Example of adding meshes dynamically (this could be triggered by an event)
//     const handleAddMesh = () => {
//         const nextX = meshes.length * 30; // Adjust spacing as needed
//         addMesh(nextX);
//     };

//     return (
//         <div>
//             <Canvas orthographic camera={{ position: [0, 0, 100], zoom: 1, up: [0, 0, 1], far: 1000 }}>
//                 <color attach="background" args={["#000"]} />
//                 <ambientLight intensity={0.5} />
//                 <OrbitControls enableZoom={false} />
//                 {meshes.map((mesh, index) => (
//                     <mesh key={index} position={[mesh.x - scrollPos, 0, 0]}>
//                         <boxGeometry args={[20, 20, 20]} />
//                         <meshStandardMaterial color="green" />
//                     </mesh>
//                 ))}
//             </Canvas>
//             <button onClick={handleAddMesh}>Add Mesh</button>
//             <input type="range" min={0} max={1000} value={scrollPos}
//                 onChange={(e) => setScrollPos(Number(e.target.value))} />
//         </div>
//     );
// }

// export default MeshRow;

// import React, { useRef, useState, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';

// function Scene({ meshes }) {
//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <OrbitControls enableZoom={false} enableRotate={false} enablePan={false} />
//       {meshes.map((pos, index) => (
//         <mesh key={index} position={[pos, 0, 0]}>
//           <boxGeometry args={[20, 20, 20]} />
//           <meshStandardMaterial color={'teal'} />
//         </mesh>
//       ))}
//     </>
//   );
// }

// function MeshRow() {
//   const [meshes, setMeshes] = useState([]);
//   const containerRef = useRef();

//   const addMesh = () => {
//     const newMeshPosition = meshes.length * 30; // Each mesh is 30 units apart
//     const updatedMeshPositions = meshes.map(pos => pos - 30); // Shift all existing meshes to the left
//     setMeshes([...updatedMeshPositions, newMeshPosition]);
//   };

//   useEffect(() => {
//     const neededWidth = meshes.length * 30;
//     const currentWidth = neededWidth > window.innerWidth ? neededWidth : window.innerWidth;
//     if (containerRef.current) {
//       containerRef.current.style.width = `${currentWidth}px`; // Adjust the width of the scrollable area
//       if (neededWidth > window.innerWidth) {
//         containerRef.current.scrollLeft += 30; // Auto-scroll to adjust for new mesh width
//       }
//     }
//   }, [meshes]); // Depend on meshes to trigger this effect

//   return (
//     <div ref={containerRef} style={{
//       width: '100vw',
//       overflowX: meshes.length * 30 > window.innerWidth ? 'auto' : 'hidden',
//       height: '100vh',
//       position: 'relative'
//     }}>
//       <button onClick={addMesh} style={{
//         position: 'fixed',
//         zIndex: 1,
//         top: '10px',
//         left: '10px'
//       }}>Add Mesh</button>
//       <div style={{
//         width: `${meshes.length * 30}px`, // Width should be dynamic based on mesh count
//         height: '100%'
//       }}>
//         <Canvas orthographic camera={{
//           position: [0, 0, 100],
//           left: 0,
//           right: window.innerWidth,
//           top: window.innerHeight / 2,
//           bottom: -window.innerHeight / 2,
//           far: 1000,
//           near: 1
//         }}>
//           <Scene meshes={meshes} />
//         </Canvas>
//       </div>
//     </div>
//   );
// }

// export default MeshRow;