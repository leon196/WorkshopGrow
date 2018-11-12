
var shaderUrls = [
  { name:'mesh.vert', url:'shaders/mesh.vert' },
  { name:'mesh.frag', url:'shaders/mesh.frag' },
];
var shaders = {};
var shaderLoader = new THREE.FileLoader();
var shaderLoaded = 0;
var callbackOnLoad = null;

function loadedShader (key, data) {
  shaders[key] = data;
  if (Object.keys(shaders).length == shaderUrls.length && callbackOnLoad != null) {
      callbackOnLoad();
  }
}

function load (callback) {
  callbackOnLoad = callback;
  shaderUrls.forEach(item => { shaderLoader.load(item.url, data => loadedShader(item.name, data)); });
}

window.onload = function () {

  var renderer, scene, camera, uniforms;

  load(start);

  function start () {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = 5;

    uniforms = {
      time: { value: 0 },
    }

    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shaders['mesh.vert'],
      fragmentShader: shaders['mesh.frag'],
    });
    var mesh = new THREE.Mesh(geometry, material); 
    scene.add(mesh);

    window.addEventListener('resize', resize, false);
    resize();
    requestAnimationFrame( update );
  }

  function update (elapsed) {
    requestAnimationFrame( update );

    elapsed /= 1000;
    uniforms.time.value = elapsed;
    renderer.render(scene, camera);
  }

  function resize () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    screen = {
      width: width,
      height: height,
      center: { x: width / 2, y: height / 2 },
    };
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
  }
}