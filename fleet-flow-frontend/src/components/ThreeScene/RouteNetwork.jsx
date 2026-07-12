/* eslint-disable react-hooks/purity, react-hooks/immutability --
   This scene follows the standard react-three-fiber pattern: node positions and
   line-segment buffers are mutated imperatively inside useFrame (the WebGL render
   loop, not React's render phase) for performance, and initial node placement is
   randomized once per mount via useMemo. Both are idiomatic R3F and outside the
   scope the new purity/immutability rules were designed to check. */
import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT = 90;
const CONNECT_DIST = 2.6;

function NetworkField() {
    const pointsRef = useRef();
    const linesRef = useRef();
    const mouse = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    const nodes = useMemo(() => {
        const arr = [];
        for (let i = 0; i < NODE_COUNT; i += 1) {
            arr.push({
                pos: new THREE.Vector3(
                    (Math.random() - 0.5) * 14,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6
                ),
                speed: 0.05 + Math.random() * 0.08,
                offset: Math.random() * Math.PI * 2,
            });
        }
        return arr;
    }, []);

    const positions = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
    const lineGeometry = useMemo(() => new THREE.BufferGeometry(), []);
    const maxLineVerts = NODE_COUNT * 8;
    const linePositions = useMemo(() => new Float32Array(maxLineVerts * 3), [maxLineVerts]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        nodes.forEach((n, i) => {
            const x = n.pos.x + Math.sin(t * n.speed + n.offset) * 0.4;
            const y = n.pos.y + Math.cos(t * n.speed + n.offset) * 0.3;
            const z = n.pos.z;
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        });

        if (pointsRef.current) {
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        let vertIndex = 0;
        for (let i = 0; i < NODE_COUNT && vertIndex < maxLineVerts - 2; i += 1) {
            for (let j = i + 1; j < NODE_COUNT && vertIndex < maxLineVerts - 2; j += 1) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < CONNECT_DIST) {
                    linePositions[vertIndex * 3] = positions[i * 3];
                    linePositions[vertIndex * 3 + 1] = positions[i * 3 + 1];
                    linePositions[vertIndex * 3 + 2] = positions[i * 3 + 2];
                    vertIndex += 1;
                    linePositions[vertIndex * 3] = positions[j * 3];
                    linePositions[vertIndex * 3 + 1] = positions[j * 3 + 1];
                    linePositions[vertIndex * 3 + 2] = positions[j * 3 + 2];
                    vertIndex += 1;
                }
            }
        }
        for (let k = vertIndex; k < maxLineVerts; k += 1) {
            linePositions[k * 3] = 0;
            linePositions[k * 3 + 1] = 0;
            linePositions[k * 3 + 2] = 0;
        }

        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.attributes.position.needsUpdate = true;
        lineGeometry.setDrawRange(0, vertIndex);

        const targetX = (mouse.current.x * viewport.width) / 22;
        const targetY = (mouse.current.y * viewport.height) / 22;
        if (pointsRef.current) {
            pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.02;
            pointsRef.current.rotation.x += (-targetY - pointsRef.current.rotation.x) * 0.02;
        }
        if (linesRef.current) {
            linesRef.current.rotation.y = pointsRef.current ? pointsRef.current.rotation.y : 0;
            linesRef.current.rotation.x = pointsRef.current ? pointsRef.current.rotation.x : 0;
        }
    });

    const handlePointerMove = (e) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, []);

    return (
        <>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} count={NODE_COUNT} array={positions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#38bdf8" size={0.055} sizeAttenuation transparent opacity={0.9} />
            </points>
            <lineSegments ref={linesRef} geometry={lineGeometry}>
                <lineBasicMaterial color="#0ea5e9" transparent opacity={0.16} />
            </lineSegments>
        </>
    );
}

const RouteNetwork = ({ reduced }) => {
    if (reduced) {
        return (
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'radial-gradient(60% 50% at 70% 30%, rgba(56,189,248,0.16), transparent), radial-gradient(40% 40% at 20% 80%, rgba(245,158,11,0.08), transparent)',
                }}
            />
        );
    }

    return (
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
            <Canvas
                camera={{ position: [0, 0, 9], fov: 55 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
            >
                <NetworkField />
            </Canvas>
        </div>
    );
};

export default RouteNetwork;
