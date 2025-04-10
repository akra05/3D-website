let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

const container = document.getElementById('canvas-container');

container.addEventListener("wheel", (event) => {
    // Verhindere das Standard-Scrollen, falls gewünscht
   rotation_buffer = 0.0005;
    // Passe den Rotationswert an – event.deltaY gibt die Scroll-Richtung und -Geschwindigkeit an
    console.log("Mausrad-Event ausgelöst:", event.deltaY);
    pivot.rotation.x += event.deltaY*rotation_buffer;
});

// Szene, Kamera und Renderer initialisieren
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0x151515);
container.appendChild(renderer.domElement);

// Licht hinzufügen
const light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 1);
scene.add(light);

// GLTFLoader für das .glb-Modell
let model = null;
const pivot = new THREE.Object3D(); // Das Pivot-Objekt
const loader = new THREE.GLTFLoader();

loader.load('assets/Knife.glb', function (gltf) {
        // Das 3D-Modell zur Szene hinzufügen
        model = gltf.scene;
        model.scale.set(80, 80, 80);

        // Berechne die Bounding Box des Modells
        const bbox = new THREE.Box3().setFromObject(model);
        const center = bbox.getCenter(new THREE.Vector3());

        // Verschiebe das Modell, sodass der Mittelpunkt des Modells im Ursprung liegt
        model.position.sub(center);  // Verschiebt das Modell so, dass der Mittelpunkt bei (0,0,0) ist

        // Füge das Modell zum Pivot hinzu
        pivot.add(model);

        // Füge das Pivot zur Szene hinzu
        scene.add(pivot);
    },
    undefined,
    function (error) {
        console.error('Ein Fehler ist beim Laden des Modells aufgetreten', error);
    }
);

// Kamera-Position
camera.position.set(0, 1, 10);

// Animationsschleife
function animate() {
    requestAnimationFrame(animate);

    // Optional: Hier kannst du die Rotation des Pivots beibehalten oder zusätzlich steuern
    // Render das Bild
     
    renderer.render(scene, camera);
}
animate();
