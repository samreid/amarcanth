(function() {
  'use strict';

  var clock = new THREE.Clock();
  var bullets = [];
  var deviceOrientationControls = null;

  var renderer = new THREE.WebGLRenderer();
  var element = renderer.domElement;
  var container = document.getElementById( 'example' );

  var camera = new THREE.PerspectiveCamera( 90, 1, 0.001, 700 );
  camera.position.set( -10, 10, 0 );

  container.appendChild( element );

  var createBullet = function() {
    var bullet = new THREE.Mesh( new THREE.SphereGeometry( 2 ), sphereMaterial );
    bullet.velocity = camera.getWorldDirection().normalize().multiplyScalar( 100 );
    var step = 0.1;
    bullet.position.x = camera.position.x + bullet.velocity.x * step;
    bullet.position.y = camera.position.y + bullet.velocity.y * step;
    bullet.position.z = camera.position.z + bullet.velocity.z * step;

    scene.add( bullet );
    bullets.push( bullet );
  };
  var isPointerDown = false;
  var pointerDown = function( event ) {
    console.log( 'hello' );
    event.preventDefault();

    isPointerDown = true;
  };

  var pointerUp = function( event ) {
    console.log( 'bye' );
    isPointerDown = false;
    event.preventDefault();
  };

  element.addEventListener( 'mousedown', pointerDown, false );
  element.addEventListener( 'touchstart', pointerDown, false );

  element.addEventListener( 'mouseup', pointerUp, false );
  element.addEventListener( 'touchend', pointerUp, false );

  var effect = new THREE.StereoEffect( renderer );

  var scene = new THREE.Scene();
  scene.add( camera );
  var orbitControls = new THREE.OrbitControls( camera, element );

  orbitControls.target.set(
    camera.position.x + 0.1,
    camera.position.y,
    camera.position.z
  );

  function setOrientationControls( e ) {
    if ( !e.alpha ) {
      return;
    }

    deviceOrientationControls = new THREE.DeviceOrientationControls( camera, true );
    deviceOrientationControls.connect();
    deviceOrientationControls.update();

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

    object.position.x = 20;
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

    deviceOrientationControls && deviceOrientationControls.update( dt );

    if ( isPointerDown ) {
      createBullet();
    }

    for ( var i = 0; i < bullets.length; i++ ) {
      var bullet = bullets[ i ];
      bullet.position.x = bullet.position.x + bullet.velocity.x * dt;
      bullet.position.y = bullet.position.y + bullet.velocity.y * dt;
      bullet.position.z = bullet.position.z + bullet.velocity.z * dt;

      if ( bullet.position.y <= 0 ) {
        bullet.velocity.y = Math.abs( bullet.velocity.y );
      }
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