import React, { useRef, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from 'antd';

const ThreeDModel = () => {
  const { scene } = useGLTF('/human.glb'); // Model dosyasının doğru yolda olduğundan emin olun
  const redDotRef = useRef();
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <primitive object={scene} scale={0.5} />
      <mesh
        ref={redDotRef}
        position={[0, 0.65, 0.062]} // Göğüs kısmına konumlandırın
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 32, 32]} />
        <meshStandardMaterial color="red" />
        {hovered && (
          <Html position={[0, 0.1, 0]} center>
            <Card title="Göğüs Bilgisi">
              <p>Bu bir örnek karttır.</p>
            </Card>
          </Html>
        )}
      </mesh>
    </>
  );
};

useGLTF.preload('/human.glb');

export default ThreeDModel;
