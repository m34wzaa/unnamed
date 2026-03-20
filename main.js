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
// geos.push({ id: 'ear',       gltf: loadModel('objects/player/ear.gltf') });       // File not found
// geos.push({ id: 'flapl1',    gltf: loadModel('objects/player/flapl1.gltf') });    // File not found
// geos.push({ id: 'flapl2',    gltf: loadModel('objects/player/flapl2.gltf') });    // File not found
// geos.push({ id: 'flapr1',    gltf: loadModel('objects/player/flapr1.gltf') });    // File not found
// geos.push({ id: 'flapr2',    gltf: loadModel('objects/player/flapr2.gltf') });    // File not found
   geos.push({ id: 'head',      gltf: loadModel('objects/player/head.gltf') });
// geos.push({ id: 'tail1',     gltf: loadModel('objects/player/tail1.gltf') });     // File not found
// geos.push({ id: 'tail2',     gltf: loadModel('objects/player/tail2.gltf') });     // File not found
// geos.push({ id: 'tail3',     gltf: loadModel('objects/player/tail3.gltf') });     // File not found
// geos.push({ id: 'tailflapl', gltf: loadModel('objects/player/tailflapl.gltf') }); // File not found
// geos.push({ id: 'tailflapr', gltf: loadModel('objects/player/tailflapr.gltf') }); // File not found
   geos.push({ id: 'torso',     gltf: loadModel('objects/player/torso.gltf') });
// geos.push({ id: 'wingl1',    gltf: loadModel('objects/player/wingl1.gltf') });    // File not found
// geos.push({ id: 'wingl2',    gltf: loadModel('objects/player/wingl2.gltf') });    // File not found
// geos.push({ id: 'wingl3',    gltf: loadModel('objects/player/wingl3.gltf') });    // File not found
// geos.push({ id: 'wingr1',    gltf: loadModel('objects/player/wingr1.gltf') });    // File not found
// geos.push({ id: 'wingr2',    gltf: loadModel('objects/player/wingr2.gltf') });    // File not found
// geos.push({ id: 'wingr3',    gltf: loadModel('objects/player/wingr3.gltf') });    // File not found
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