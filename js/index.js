(function() {
  'use strict';

  var clock = new THREE.Clock();
  var sphere = null;

  var renderer = new THREE.WebGLRenderer();
  var element = renderer.domElement;
  var container = document.getElementById( 'example' );
  container.appendChild( element );

  var pointerDown = function( event ) {
    console.log( 'hello' );
    event.preventDefault();

    sphere = new THREE.Mesh( new THREE.SphereGeometry( 30 ), sphereMaterial );
    sphere.position.x = 100 + 20;
    sphere.position.y = 40;

    scene.add( sphere );
  };

  var pointerUp = function( event ) {
    console.log( 'bye' );
  };

  element.addEventListener( 'mousedown', pointerDown, false );
  element.addEventListener( 'touchstart', pointerDown, false );

  element.addEventListener( 'mouseup', pointerUp, false );
  element.addEventListener( 'touchend', pointerUp, false );

  var effect = new THREE.StereoEffect( renderer );

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera( 90, 1, 0.001, 700 );
  camera.position.set( -10, 10, 0 );
  scene.add( camera );

  var controls = new THREE.OrbitControls( camera, element );
  controls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );

  function setOrientationControls( e ) {
    if ( !e.alpha ) {
      return;
    }

    var controls = new THREE.DeviceOrientationControls( camera, true );
    controls.connect();
    controls.update();

    element.addEventListener( 'click', fullscreen, false );

    window.removeEventListener( 'deviceorientation', setOrientationControls, true );
  }

  window.addEventListener( 'deviceorientation', setOrientationControls, true );

  var texture = THREE.ImageUtils.loadTexture(
    'textures/patterns/checker.png'
  );
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2( 50, 50 );
  texture.anisotropy = renderer.getMaxAnisotropy();

  var material = new THREE.MeshPhongMaterial( {
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 20,
    shading: THREE.FlatShading,
    map: texture
  } );

  var geometry = new THREE.PlaneGeometry( 1000, 1000 );

  var mesh = new THREE.Mesh( geometry, material );
  mesh.rotation.x = -Math.PI / 2;
  scene.add( mesh );

  var sphereMaterial = new THREE.MeshLambertMaterial( {
    color: 0xCC00FF
  } );

  window.addEventListener( 'resize', resize, false );
  setTimeout( resize, 1 );

  var loader = new THREE.AssimpLoader();
  var octaminatorAnimation = null;
  loader.load( '../three.js/examples/models/assimp/octaminator/Octaminator.assimp', function( err, result ) {

    var object = result.object;

    object.position.x = 30;
    object.position.y = 13;
    object.rotation.x = 0;
    object.rotation.y = Math.PI / 2 + Math.PI / 12;
    var scale = 0.05;
    object.scale.x = scale;
    object.scale.y = scale;
    object.scale.z = scale;
    scene.add( object );

    octaminatorAnimation = result.animation;
  } );

  var axisHelper = new THREE.AxisHelper( 5 );
  scene.add( axisHelper );

  var ambient = new THREE.HemisphereLight( 0x8888fff, 0xff8888, 0.5 );
  ambient.position.set( 0, 1, 0 );
  scene.add( ambient );

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 0, 4, 4 ).normalize();
  scene.add( light );

  animate();

  function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize( width, height );
    effect.setSize( width, height );
  }

  function update( dt ) {
    resize();

    camera.updateProjectionMatrix();

    controls.update( dt );

    if ( sphere ) {
      sphere.position.x = Math.sin( Date.now() / 1000 ) * 200 + 300;
      sphere.position.z = Math.cos( Date.now() / 2730 ) * 200 + 100;
    }

    octaminatorAnimation && octaminatorAnimation.setTime( performance.now() / 1000 );
  }

  function render( dt ) {
    effect.render( scene, camera );
  }

  function animate( t ) {
    requestAnimationFrame( animate );

    update( clock.getDelta() );
    render( clock.getDelta() );
  }

  function fullscreen() {
    if ( container.requestFullscreen ) {
      container.requestFullscreen();
    }
    else if ( container.msRequestFullscreen ) {
      container.msRequestFullscreen();
    }
    else if ( container.mozRequestFullScreen ) {
      container.mozRequestFullScreen();
    }
    else if ( container.webkitRequestFullscreen ) {
      container.webkitRequestFullscreen();
    }
  }
})();