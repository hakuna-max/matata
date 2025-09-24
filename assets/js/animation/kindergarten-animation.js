// assets/js/dragon-animation.js

// 1. 从 node_modules 导入依赖项。Hugo 的 js.Build 会自动找到它们。
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";

// 2. 将所有逻辑封装在一个函数中，并默认导出
export default function initDragonAnimation() {
  // 3. 安全检查：如果页面上没有 #world 容器，则不执行任何操作
  const container = document.getElementById("world");
  if (!container) {
    return;
  }

  // --- SETUP & GLOBAL VARIABLES (scoped to this function) ---
  let scene, camera, controls, renderer;
  let dragon,
    sneezingRate = 0,
    fireRate = 0,
    timeSmoke = 0,
    timeFire = 0;
  let sneezeTimeout;

  const maxSneezingRate = 8,
    sneezeDelay = 500,
    globalSpeedRate = 1;
  let awaitingSmokeParticles = [];

  // --- INITIALIZATION ---
  function init() {
    scene = new THREE.Scene();
    const WIDTH = container.clientWidth;
    const HEIGHT = container.clientHeight;

    camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 2000);
    camera.position.set(-150, 80, 150);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize, false);
    container.addEventListener("mouseup", handleMouseUp, false);
    container.addEventListener("touchend", handleTouchEnd, false);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
  }

  // --- EVENT HANDLERS ---
  function onWindowResize() {
    if (!container) return;
    const WIDTH = container.clientWidth;
    const HEIGHT = container.clientHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }

  function handleMouseUp(event) {
    if (sneezeTimeout) clearTimeout(sneezeTimeout);
    sneezingRate += (maxSneezingRate - sneezingRate) / 10;
    dragon.prepareToSneeze(sneezingRate);
    sneezeTimeout = setTimeout(sneeze, sneezeDelay * globalSpeedRate);
    dragon.isSneezing = true;
  }

  function sneeze() {
    dragon.sneeze(sneezingRate);
    sneezingRate = 0;
  }

  function handleTouchEnd(event) {
    if (sneezeTimeout) clearTimeout(sneezeTimeout);
    sneezingRate += (maxSneezingRate - sneezingRate) / 10;
    dragon.prepareToSneeze(sneezingRate);
    sneezeTimeout = setTimeout(sneeze, sneezeDelay * globalSpeedRate);
    dragon.isSneezing = true;
  }

  // --- SCENE CREATION ---
  function createLights() {
    const light = new THREE.HemisphereLight(0xffffff, 0xb3858c, 0.8);
    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);
    shadowLight.position.set(-100, 100, 50);
    shadowLight.castShadow = true;
    const backLight = new THREE.DirectionalLight(0xffffff, 0.4);
    backLight.position.set(200, 100, 100);
    backLight.castShadow = true;
    scene.add(backLight, light, shadowLight);
  }

  function createFloor() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshBasicMaterial({
        color: 0x652e37,
        transparent: true,
        opacity: 0.2,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -36;
    floor.receiveShadow = true;
    scene.add(floor);
  }

  function createDragon() {
    dragon = new Dragon();
    scene.add(dragon.threegroup);
  }

  function makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(posX, posY, posZ);
    mesh.rotation.set(rotX, rotY, rotZ);
    return mesh;
  }

  // --- DRAGON OBJECT ---
  const Dragon = function () {
    this.tailAmplitude = 3;
    this.tailAngle = 0;
    this.tailSpeed = 0.07;
    this.wingAmplitude = Math.PI / 8;
    this.wingAngle = 0;
    this.wingSpeed = 0.1;
    this.isSneezing = false;
    this.threegroup = new THREE.Group();

    const greenMat = new THREE.MeshLambertMaterial({ color: 0x5da683 });
    const yellowMat = new THREE.MeshLambertMaterial({ color: 0xfdde8c });
    const redMat = new THREE.MeshLambertMaterial({ color: 0xcb3e4c });
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xfaf3d7 });
    const brownMat = new THREE.MeshLambertMaterial({ color: 0x874a5c });
    const blackMat = new THREE.MeshLambertMaterial({ color: 0x403133 });

    this.body = new THREE.Group();
    this.belly = makeCube(greenMat, 30, 30, 40, 0, 0, 0, 0, 0, Math.PI / 4);
    this.wingL = makeCube(
      yellowMat,
      5,
      30,
      20,
      15,
      15,
      0,
      -Math.PI / 4,
      0,
      -Math.PI / 4
    );
    this.wingL.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, 15, 10)
    );
    this.wingR = this.wingL.clone();
    this.wingR.position.x = -this.wingL.position.x;
    this.wingR.rotation.z = -this.wingL.rotation.z;

    this.tail = new THREE.Group();
    this.tail.position.set(0, 10, -20);
    const tailMat = new THREE.LineBasicMaterial({ color: 0x5da683 });
    const tailPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 5, -10),
      new THREE.Vector3(0, -5, -20),
      new THREE.Vector3(0, 0, -30),
    ];
    const tailGeom = new THREE.BufferGeometry().setFromPoints(tailPoints);
    this.tailLine = new THREE.Line(tailGeom, tailMat);
    this.tailLine.userData.originalPoints = tailPoints.map((p) => p.clone());
    const pikeGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
    pikeGeom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    this.tailPike = new THREE.Mesh(pikeGeom, yellowMat);
    this.tailPike.scale.set(0.2, 1, 1);
    this.tailPike.position.set(0, 0, -35);
    this.tail.add(this.tailLine, this.tailPike);

    this.head = new THREE.Group();
    this.head.position.z = 30;
    this.face = makeCube(greenMat, 60, 50, 80, 0, 25, 40, 0, 0, 0);
    const hornGeom = new THREE.CylinderGeometry(0, 6, 10, 4, 1);
    this.hornL = new THREE.Mesh(hornGeom, yellowMat);
    this.hornL.position.set(10, 55, 10);
    this.hornR = this.hornL.clone();
    this.hornR.position.x = -10;
    this.earL = makeCube(greenMat, 5, 10, 20, 32, 42, 2, 0, 0, 0);
    this.earL.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, 5, -10)
    );
    this.earL.geometry.applyMatrix4(
      new THREE.Matrix4().makeRotationX(Math.PI / 4)
    );
    this.earL.geometry.applyMatrix4(
      new THREE.Matrix4().makeRotationY(-Math.PI / 4)
    );
    this.earR = this.earL.clone();
    this.earR.position.set(-32, 42, 2);
    this.earR.rotation.y = Math.PI / 2;
    this.mouth = new THREE.Group();
    this.mouth.position.set(0, 3, 50);
    this.jaw = makeCube(greenMat, 30, 10, 30, 0, -5, 15, 0, 0, 0);
    this.tongue = makeCube(redMat, 20, 10, 20, 0, -3, 15, 0, 0, 0);
    this.mouth.add(this.jaw, this.tongue);
    const smileGeom = new THREE.TorusGeometry(6, 2, 2, 10, Math.PI);
    this.smile = new THREE.Mesh(smileGeom, blackMat);
    this.smile.position.set(0, 5, 82);
    this.smile.rotation.z = -Math.PI;
    this.eyeL = makeCube(whiteMat, 10, 22, 22, 27, 34, 18, 0, 0, 0);
    this.eyeR = this.eyeL.clone();
    this.eyeR.position.x = -27;
    this.irisL = makeCube(brownMat, 10, 12, 12, 28, 30, 24, 0, 0, 0);
    this.irisR = this.irisL.clone();
    this.irisR.position.x = -this.irisL.position.x;
    this.noseL = makeCube(blackMat, 5, 5, 8, 5, 40, 77, 0, 0, 0);
    this.noseR = this.noseL.clone();
    this.noseR.position.x = -this.noseL.position.x;

    this.head.add(
      this.face,
      this.hornL,
      this.hornR,
      this.earL,
      this.earR,
      this.mouth,
      this.smile,
      this.eyeL,
      this.eyeR,
      this.irisL,
      this.irisR,
      this.noseL,
      this.noseR
    );
    this.body.add(this.belly, this.wingL, this.wingR, this.tail);
    this.legFL = makeCube(greenMat, 20, 10, 20, 20, -30, 15, 0, 0, 0);
    this.legFR = this.legFL.clone();
    this.legFR.position.x = -30;
    this.legBL = this.legFL.clone();
    this.legBL.position.z = -15;
    this.legBR = this.legBL.clone();
    this.legBR.position.x = -30;

    this.threegroup.add(
      this.body,
      this.head,
      this.legFL,
      this.legFR,
      this.legBL,
      this.legBR
    );
    this.threegroup.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  };

  Dragon.prototype.update = function () {
    this.tailAngle += this.tailSpeed / globalSpeedRate;
    const positions = this.tailLine.geometry.attributes.position;
    const originalPoints = this.tailLine.userData.originalPoints;
    for (let i = 0; i < originalPoints.length; i++) {
      const p = originalPoints[i];
      const y =
        Math.sin(this.tailAngle - (Math.PI / 3) * i) *
        this.tailAmplitude *
        i *
        i;
      const x =
        Math.cos(this.tailAngle / 2 + (Math.PI / 10) * i) *
        this.tailAmplitude *
        i *
        i;
      positions.setXYZ(i, p.x + x, p.y + y, p.z);
      if (i === originalPoints.length - 1) {
        this.tailPike.position.set(p.x + x, p.y + y, this.tailPike.position.z);
        this.tailPike.rotation.x = y / 30;
      }
    }
    positions.needsUpdate = true;
    this.wingAngle += this.wingSpeed / globalSpeedRate;
    this.wingL.rotation.z =
      -Math.PI / 4 + Math.cos(this.wingAngle) * this.wingAmplitude;
    this.wingR.rotation.z =
      Math.PI / 4 - Math.cos(this.wingAngle) * this.wingAmplitude;
  };

  Dragon.prototype.prepareToSneeze = function (s) {
    const speed = 0.7 * globalSpeedRate;
    const ease = "back.out(1.7)";
    gsap.to(this.head.rotation, { duration: speed, x: -s * 0.12, ease: ease });
    gsap.to(this.head.position, {
      duration: speed,
      z: 30 - s * 2.2,
      y: s * 2.2,
      ease: ease,
    });
    gsap.to(this.mouth.rotation, { duration: speed, x: s * 0.18, ease: ease });
  };

  Dragon.prototype.sneeze = function (s) {
    const speed = 0.1 * globalSpeedRate;
    timeFire = Math.round(s * 10);
    const onComplete = () => {
      this.backToNormal(s);
      fireRate = s;
    };
    gsap.to(this.head.rotation, {
      duration: speed,
      x: s * 0.05,
      ease: "back.out(1.7)",
    });
    gsap.to(this.head.position, {
      duration: speed,
      z: 30 + s * 2.4,
      y: -s * 0.4,
      ease: "back.out(1.7)",
      onComplete,
    });
  };

  Dragon.prototype.backToNormal = function (s) {
    const onComplete = () => {
      this.isSneezing = false;
      timeSmoke = Math.round(s * 5);
    };
    gsap.to(this.head.rotation, {
      duration: 1,
      x: 0,
      ease: "strong.inOut",
      onComplete,
    });
    gsap.to(this.head.position, {
      duration: 1,
      z: 30,
      y: 0,
      ease: "back.out(1.7)",
    });
  };

  // --- MAIN LOOP ---
  function loop() {
    requestAnimationFrame(loop);
    if (dragon && !dragon.isSneezing) {
      dragon.update();
    }
    if (controls) controls.update();
    if (renderer && scene && camera) renderer.render(scene, camera);
  }

  // --- START THE EXPERIENCE ---
  init();
  createLights();
  createFloor();
  createDragon();
  loop();
}
