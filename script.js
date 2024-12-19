let isMouseDown = false;
let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener("mousedown", (event) => {
    isMouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
});

document.addEventListener("mouseup", () => {
    isMouseDown = false;
});

document.addEventListener("mousemove", (event) => {
    if (isMouseDown && model) {
        const deltaX = event.clientX - lastMouseX; // Differenz der Mausbewegung in X
        const deltaY = event.clientY - lastMouseY; // Differenz der Mausbewegung in Y

        // Geschwindigkeit der Rotation anpassen
        const rotationSpeed = 0.02;

        // Rotation basierend auf Mausbewegung berechnen
        const newRotationX = pivot.rotation.x + deltaY * rotationSpeed;
        pivot.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, newRotationX));
        pivot.rotation.y += deltaX * rotationSpeed; // Drehung um Y-Achse (horizontal)
        

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
});

// Szene, Kamera und Renderer initialisieren
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x440000);
document.body.appendChild(renderer.domElement);

// Licht hinzufügen
const light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, 1);
scene.add(light);

// GLTFLoader für das .glb-Modell
let model = null;
const pivot = new THREE.Object3D(); // Das Pivot-Objekt
const loader = new THREE.GLTFLoader();

loader.load(
    'assets/Knife.glb', // Pfad zu deinem GLB-Modell
    function (gltf) {
        // Das 3D-Modell zur Szene hinzufügen
        model = gltf.scene;
        model.scale.set(30, 30, 30);

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
