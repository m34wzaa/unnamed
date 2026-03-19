import * as THREE from 'three';
import { GLTFLoader } from 'gltfloader';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);  
const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) 
const fog = new THREE.FogExp2(0x000000, 0.01); 
scene.fog = fog; 
cam.position.set(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
let room = null;
let roomBoundingBox = new THREE.Box3();

function loadModel(modelPath) {
    loader.load(
        modelPath,
        function (gltf) {
            scene.add(gltf.scene);
            room = gltf.scene;

            // Update matrices
            gltf.scene.updateMatrixWorld();

            // Compute bounding box for the room
            roomBoundingBox.setFromObject(gltf.scene);

            gltf.scene.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.color.set(0xdddddd);
                    child.material.roughness = 0.8;
                    child.material.metalness = 0.2; 
                }
            });
        },
        undefined, // onProgress
        function (error) {
            console.error('Error loading GLTF model:', modelPath, error);
        }
    );
}
const geos = []
// loadModel('objects/scene.gltf'); // Commented out due to invalid GLTF file

// Load each GLTF file in the player folder in specific order
geos.push(loadModel('objects/player/earl.gltf'));
geos.push(loadModel('objects/player/earr.gltf'));
geos.push(loadModel('objects/player/flapl1.gltf'));
geos.push(loadModel('objects/player/flapl2.gltf'));
geos.push(loadModel('objects/player/flapr1.gltf'));
geos.push(loadModel('objects/player/flapr2.gltf'));
geos.push(loadModel('objects/player/head.gltf'));
geos.push(loadModel('objects/player/tail1.gltf'));
geos.push(loadModel('objects/player/tail2.gltf'));
geos.push(loadModel('objects/player/tail3.gltf'));
geos.push(loadModel('objects/player/tailflapl.gltf'));
geos.push(loadModel('objects/player/tailflapr.gltf'));
geos.push(loadModel('objects/player/torso.gltf'));
geos.push(loadModel('objects/player/wingl1.gltf'));
geos.push(loadModel('objects/player/wingl2.gltf'));
geos.push(loadModel('objects/player/wingl3.gltf'));
geos.push(loadModel('objects/player/wingr1.gltf'));
geos.push(loadModel('objects/player/wingr2.gltf'));
geos.push(loadModel('objects/player/wingr3.gltf'));
const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.5 });
const players = [];
for (let i = 0; i < 10; i++) {
    const player = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat); // Placeholder geometry
    players.push(player);
    scene.add(player);
}
const box = new THREE.BoxGeometry(2,2,2);
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