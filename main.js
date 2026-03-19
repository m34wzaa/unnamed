import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';
import { any } from 'three/src/nodes/math/MathNode.js';

// Create a scene
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const fog = new THREE.FogExp2(0x000000, 0.01);
scene.fog = fog;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
let room = any;
let roomBoundingBox = new THREE.Box3();

function loadModel(modelPath) {
    loader.load(modelPath, function (gltf) {
        scene.add(gltf.scene);
        room = gltf.scene;

        // Compute bounding box for the room
        roomBoundingBox.setFromObject(gltf.scene);

        gltf.scene.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.color.set(0xdddddd);
                child.material.roughness = 0.8;
                child.material.metalness = 0.2; 
            }
        });
    });
}
const geos = []
loadModel('player/torso.gltf'); 
const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.5 });
const players = [];
for (let i = 0; i < 10; i++) {
    const player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat); // Placeholder geometry
    players.push(player);
    scene.add(player);
}
const box = new THREE.BoxGeometry(2,2,2);
const playerHitBox = new THREE.Box3().setFromObject(box);
function anim() {
    requestAnimationFrame(anim);

    // Update player hitboxes and check collisions
    players.forEach(player => {
        const playerBox = new THREE.Box3().setFromObject(player);
        if (roomBoundingBox.intersectsBox(playerBox)) {
            // Collision detected - handle it (e.g., prevent movement, apply force, etc.)
            console.log('Collision detected with room!');
            // Example: Move player back slightly
            player.position.y += 0.1; // Adjust as needed
        }
    });

    renderer.render(scene, cam);
}
anim();