/*
<script type="importmap">
{
    "imports": {
        "three": "https://unpkg.com/three@0.162.0/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.162.0/examples/jsm/"
    }
}
</script>

<script type="module">
const CONFIG = {
  shape: "cube", // 初始形狀: sphere, cube, torus, icosahedron, teapot, dna
  particleSize: 0.035, // 粒子大小
  particleColor: 0x5c7f65, // 粒子顏色 (16進位數)
  rotationSpeed: 0.2, // 旋轉速度
  bloomStrength: 0.8, // 泛光強度
  bloomRadius: 0.5, // 泛光半徑
  bloomThreshold: 0.85, // 泛光閾值
  ambientLightIntensity: 0.7, // 環境光強度
  directionalLightIntensity: 1, // 平行光強度
  motionTrail: 0.3, // 運動拖曳
};

init(CONFIG);
animate();
</script>
*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TeapotGeometry } from "three/addons/geometries/TeapotGeometry.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";

let scene, camera, renderer, controls, particleSystem, currentGeometry;
const numParticles = 25000;
const clock = new THREE.Clock();
let targetPositions = [];
let animationProgress = 1;
const animationDuration = 1.5;
let composer, bloomPass;
let trailTexture, trailScene, trailCamera, trailComposer;

// Preset parameters
const SPHERE_PARAMS = {
  shape: "sphere",
  particleSize: 0.03,
  particleColor: 0x5c7f65,
  rotationSpeed: 0.1,
  bloomStrength: 0.8,
  bloomRadius: 0.5,
  bloomThreshold: 0.85,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  motionTrail: 0.3,
};

const CUBE_PARAMS = {
  shape: "cube",
  particleSize: 0.035,
  particleColor: 0x5c7f65,
  rotationSpeed: 0.2,
  bloomStrength: 0.8,
  bloomRadius: 0.5,
  bloomThreshold: 0.85,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  motionTrail: 0.3,
};

const TORUS_PARAMS = {
  shape: "torus",
  particleSize: 0.03,
  particleColor: 0x5c7f65,
  rotationSpeed: 0.18,
  bloomStrength: 0.9,
  bloomRadius: 0.55,
  bloomThreshold: 0.8,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  motionTrail: 0.25,
};

const ICOSAHEDRON_PARAMS = {
  shape: "icosahedron",
  particleSize: 0.035,
  particleColor: 0x5c7f65,
  rotationSpeed: 0.2,
  bloomStrength: 0.7,
  bloomRadius: 0.5,
  bloomThreshold: 0.85,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  motionTrail: 0.3,
};

const TEAPOT_PARAMS = {
  shape: "teapot",
  particleSize: 0.035,
  particleColor: 0x5c7f65,
  rotationSpeed: 0.2,
  bloomStrength: 0.7,
  bloomRadius: 0.5,
  bloomThreshold: 0.85,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  motionTrail: 0.3,
};

const DNA_PARAMS = {
  shape: "dna",
  particleSize: 0.035,
  particleColor: 0x5c7f65,
  rotationSpeed: 0.2,
  bloomStrength: 0.7,
  bloomRadius: 0.5,
  bloomThreshold: 0.85,
  ambientLightIntensity: 0.7,
  directionalLightIntensity: 1,
  motionTrail: 0.3,
};

function initScenes(params) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0e0e0e);
  scene.fog = new THREE.Fog(0x0e0e0e, 10, 50);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  document.getElementById("container").appendChild(renderer.domElement);

  trailScene = new THREE.Scene();
  trailCamera = camera.clone();
  trailTexture = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    },
  );
}

function initLights(params) {
  const ambientLight = new THREE.AmbientLight(
    0xffffff,
    params.ambientLightIntensity,
  );
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(
    0xffffff,
    params.directionalLightIntensity,
  );
  directionalLight.position.set(1, 3, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
}

function initComposers(params) {
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    params.bloomStrength,
    params.bloomRadius,
    params.bloomThreshold,
  );
  composer.addPass(bloomPass);

  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaCorrectionPass);

  trailComposer = new EffectComposer(renderer, trailTexture);
  const trailRenderPass = new RenderPass(trailScene, trailCamera);
  trailComposer.addPass(trailRenderPass);
}

function initControls(params) {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.enableZoom = false;
}

function createParticleSystem(params) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numParticles * 3);
  const colors = new Float32Array(numParticles * 3);
  const sizes = new Float32Array(numParticles);

  targetPositions = new Float32Array(numParticles * 3);

  for (let i = 0; i < numParticles; i++) {
    const phi = Math.acos(-1 + (2 * i) / numParticles);
    const theta = Math.sqrt(numParticles * Math.PI) * phi;
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);

    positions[i * 3] = x * 1.5;
    positions[i * 3 + 1] = y * 1.5;
    positions[i * 3 + 2] = z * 1.5;

    targetPositions[i * 3] = positions[i * 3];
    targetPositions[i * 3 + 1] = positions[i * 3 + 1];
    targetPositions[i * 3 + 2] = positions[i * 3 + 2];

    const color = new THREE.Color(params.particleColor);
    color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.5);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;

    sizes[i] = params.particleSize * (0.8 + Math.random() * 0.4);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: params.particleSize,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    depthWrite: false,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  const trailParticles = particleSystem.clone();
  trailScene.add(trailParticles);
}

function initTrailEffect(params) {
  const trailMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      opacity: { value: 0.9 },
    },
    vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
    fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float opacity;
                varying vec2 vUv;
                void main() {
                    vec4 texel = texture2D(tDiffuse, vUv);
                    gl_FragColor = opacity * texel;
                }
            `,
  });

  const trailPass = new ShaderPass(trailMaterial);
  trailPass.renderToScreen = true;
  composer.addPass(trailPass);
}

function createDNAShape() {
  const points = [];
  const numPoints = 100;
  const radius = 1;
  const height = 3;
  const turns = 2;

  for (let i = 0; i < numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2 * turns;
    const x = Math.cos(t) * radius;
    const y = (i / numPoints) * height - height / 2;
    const z = Math.sin(t) * radius;
    points.push(new THREE.Vector3(x, y, z));

    const offset = Math.PI;
    const x2 = Math.cos(t + offset) * radius;
    const z2 = Math.sin(t + offset) * radius;
    points.push(new THREE.Vector3(x2, y, z2));
  }

  return points;
}

function morphToShape(params) {
  let targetGeometry;
  let targetVertices = [];
  let shapeType = params.shape;

  switch (shapeType) {
    case "sphere":
      targetGeometry = new THREE.SphereGeometry(1.5, 64, 64);
      break;
    case "cube":
      targetGeometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
      break;
    case "torus":
      targetGeometry = new THREE.TorusGeometry(1.2, 0.4, 32, 200);
      break;
    case "icosahedron":
      targetGeometry = new THREE.IcosahedronGeometry(1.7, 3);
      break;
    case "teapot":
      targetGeometry = new TeapotGeometry(1.2, 16);
      break;
    case "dna":
      targetVertices = createDNAShape();
      break;
    default:
      return;
  }

  if (shapeType !== "dna") {
    targetGeometry.computeVertexNormals();
    const targetPositionAttribute = targetGeometry.getAttribute("position");
    for (let i = 0; i < targetPositionAttribute.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(targetPositionAttribute, i);
      targetVertices.push(vertex);
    }
  }

  for (let i = 0; i < numParticles; i++) {
    const vertexIndex = i % targetVertices.length;
    const targetVertex = targetVertices[vertexIndex];
    targetPositions[i * 3] = targetVertex.x;
    targetPositions[i * 3 + 1] = targetVertex.y;
    targetPositions[i * 3 + 2] = targetVertex.z;
  }

  animationProgress = 0;
  if (shapeType !== "dna") {
    currentGeometry = targetGeometry;
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  trailTexture.setSize(window.innerWidth, window.innerHeight);
  trailComposer.setSize(window.innerWidth, window.innerHeight);
}

function init(params) {
  initScenes(params);
  initLights(params);
  initComposers(params);
  initControls(params);
  createParticleSystem(params);
  initTrailEffect(params);
  morphToShape(params);
  // window.addEventListener("resize", onWindowResize, false);
  // 按兩下復位
  // renderer.domElement.addEventListener("dblclick", () => {
  //   camera.position.set(0, 0, 5);
  //   camera.lookAt(0, 0, 0);
  //   controls.reset();
  // });
}

function animate(params) {
  requestAnimationFrame(() => animate(params));

  const delta = clock.getDelta();

  if (particleSystem) {
    particleSystem.rotation.y += delta * params.rotationSpeed;

    if (animationProgress < 1) {
      animationProgress += delta / animationDuration;
      animationProgress = Math.min(animationProgress, 1);

      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < numParticles * 3; i++) {
        positions[i] +=
          (targetPositions[i] - positions[i]) * (delta / animationDuration);
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
    }
  }

  renderer.setRenderTarget(trailTexture);
  renderer.render(scene, camera);
  renderer.setRenderTarget(null);

  controls.update();
  composer.render();
}

export {
  init,
  animate,
  SPHERE_PARAMS,
  CUBE_PARAMS,
  TORUS_PARAMS,
  ICOSAHEDRON_PARAMS,
  TEAPOT_PARAMS,
  DNA_PARAMS,
};
