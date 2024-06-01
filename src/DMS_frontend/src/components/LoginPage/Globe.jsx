import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import { useDrag } from 'react-use-gesture';
import { a, useSpring } from '@react-spring/three';

const providerLocations = [
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco, USA' },
  { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
  { lat: 41 - 33, lon: 28 - 24, name: 'Istanbul, Turkey' },
  { lat: 39.9334, lon: 32.8597, name: 'Ankara, Turkey' },
  { lat: 38.4237, lon: 27.1428, name: 'Izmir, Turkey' },
  { lat: 36.8969 - 33, lon: 30.7133 - 24, name: 'Antalya, Turkey' },
  { lat: 40.1826 - 35, lon: 29.0662 - 24, name: 'Bursa, Turkey' },
  // Add more provider locations here
];

const latLonToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

const ProviderMarkers = ({ providerRefs, setHoveredProvider, setTooltipPosition }) => {
  const { camera, gl, raycaster } = useThree();

  useFrame((state) => {
    raycaster.setFromCamera(state.mouse, camera);
    const intersects = raycaster.intersectObjects(providerRefs.current);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      const { name } = intersect.object.userData;
      setHoveredProvider(name);
      const canvasBounds = gl.domElement.getBoundingClientRect();
      setTooltipPosition({
        x: state.mouse.x * (canvasBounds.width / 2) + canvasBounds.width / 2,
        y: -state.mouse.y * (canvasBounds.height / 2) + canvasBounds.height / 2,
      });
    } else {
      setHoveredProvider(null);
    }
  });

  return (
    <>
      {providerLocations.map((loc, index) => {
        const position = latLonToVector3(loc.lat, loc.lon, 2);
        return (
          <mesh
            key={index}
            position={position}
            ref={(el) => (providerRefs.current[index] = el)}
            userData={{ name: loc.name }}
          >
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        );
      })}
    </>
  );
};

const Globe = ({ setHoveredProvider, setTooltipPosition }) => {
  const texture = useLoader(TextureLoader, '/8k_earth_daymap.jpg');
  const globeRef = useRef();
  const providerRefs = useRef([]);

  const [{ rotation }, setRotation] = useSpring(() => ({
    rotation: [0, 0, 0],
  }));

  const bind = useDrag(({ movement: [mx, my], memo = rotation.get() }) => {
    setRotation({
      rotation: [memo[0] + my * 0.005, memo[1] + mx * 0.005, 0],
    });
    return memo;
  });

  useFrame(() => {
    globeRef.current.rotation.y += 0.001;
  });

  return (
    <a.mesh ref={globeRef} rotation={rotation} {...bind()}>
      <sphereGeometry args={[2, 99, 99]} />
      <meshStandardMaterial map={texture} />
      <ProviderMarkers
        providerRefs={providerRefs}
        setHoveredProvider={setHoveredProvider}
        setTooltipPosition={setTooltipPosition}
      />
      <mesh>
        <sphereGeometry args={[2.03, 88, 99]} />
        <meshPhongMaterial
          color="red"
          emissive="red"
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </a.mesh>
  );
};

const GlobeCanvas = () => {
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  return (
    <div style={{ position: 'relative' }}>
      <Canvas>
        <ambientLight intensity={1} />
        <pointLight position={[2, 3, 4]} />
        <Globe setHoveredProvider={setHoveredProvider} setTooltipPosition={setTooltipPosition} />
      </Canvas>
      {hoveredProvider && (
        <div
          style={{
            position: 'absolute',
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid black',
            borderRadius: '5px',
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%)',
          }}
        >
          {hoveredProvider}
        </div>
      )}
    </div>
  );
};

export default GlobeCanvas;
