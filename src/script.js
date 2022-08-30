/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import Stats from 'three/examples/jsm/libs/stats.module'
import { CSG } from 'three-csg-ts';

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(10, 10, 10)
scene.add(light)
const lights = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( lights );

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 3

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()
const geom= new THREE.SphereGeometry()


const material = [
    new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true }),
    new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true })
]

const cubes = [
    new THREE.Mesh(geometry, material[0]),
    // new THREE.Mesh(geometry, material[1]),
    new THREE.Mesh(geom, material[2]),
    
]
cubes[0].position.x = 0.5
cubes[0].position.y =0.5
// cubes[2].position.y =2
cubes[1].position.x = 1

cubes.forEach((c) => scene.add(c))
const control = new OrbitControls( camera, renderer.domElement );

const controls = new DragControls(cubes, camera, renderer.domElement)
controls.addEventListener('dragstart', function (event) {
    event.object.material.opacity = 0.33
    control.enabled=false

///////////////////////////

  
  // Make sure the .matrix of each mesh is current
  cubes[0].updateMatrix();
  cubes[1].updateMatrix();
//   cubes[2].updateMatrix();
  
  // Perform CSG operations
  // The result is a THREE.Mesh that you can add to your scene...
  const subRes = CSG.subtract(cubes[0], cubes[1]);
  scene.remove( cubes[0]);
  scene.add(subRes)
  cubes.shift(cubes[0])
  cubes.unshift(subRes)
  
//   subRes.position.y=-2
//   const uniRes = CSG.union(box, sphere);
//   const intRes = CSG.intersect(box, sphere);
//   scene.add(subRes)
  //////////////////////////




})
controls.addEventListener('dragend', function (event) {
    event.object.material.opacity = 1
    control.enabled=true
 
})

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

function animate() {
    requestAnimationFrame(animate)

    
    control.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()



