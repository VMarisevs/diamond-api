var Diamond = function(id, carat, cut, color, clarity, depth, table, price, x, y, z){
	this.id = (id) ? id : 0;
	this.carat = (carat) ? carat : "0.00";
	this.cut = (cut) ? cut : "None";
	this.color = (color) ? color : "T"; // for transparent
	this.clarity = (clarity) ? clarity : "NULL";
	this.depth = (depth) ? depth : "0.00";
	this.table = (table) ? table : "0";
	this.price = (price) ? price : "0.00";
	this.x = (x) ? x : "0.00";
	this.y = (y) ? y : "0.00";
	this.z = (z) ? z : "0.00";
	
}

var drawThree = function(data){
	
	var _width = 200;
	var _height = 200;
	var divId = "#dialog-d3";
	
	var stats = initStats();
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, _width / _height, 0.1, 1000);
	
	// create a render and set the size
	// comment to keep previous image
	$(divId).html("");
        var webGLRenderer = new THREE.WebGLRenderer();
        webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
        webGLRenderer.setSize(_width, _height);
        webGLRenderer.shadowMapEnabled = true;
		
		drawDiamond(data);
        
		function drawDiamond(data){
			var diamond = new Diamond(data.id, data.carat, data.cut, data.color, data.clarity, data.depth, data.table, data.price, data.x, data.y, data.z);
			
			var _caratScale = Math.round(20 * data.carat);
			var _table = 0.025 * data.table;
			var _width = 0.05 * data.table;
			var _depth = 0.05 * data.depth;
			
			var _crown = 0.3  * _depth;
			var _gridle = 0.1 * _depth;
			var _pavilion = 0.6 * _depth;
			
			var _crownY = _crown/2;
			var _gridleY = _gridle/2;
			var _pavilionY =  _pavilion/2;

			var diamondTop = createMesh(new THREE.CylinderGeometry( _table, _width, _crown, _caratScale));
				diamondTop.position.y = _gridle + _crownY;
			var diamondMiddle = createMesh(new THREE.CylinderGeometry( _width, _width, _gridle, _caratScale));
				diamondMiddle.position.y =  _gridleY;
			var diamondBottom = createMesh(new THREE.CylinderGeometry( _width, 0, _pavilion, _caratScale));
				diamondBottom.position.y =  -_pavilionY;
			scene.add(diamondTop);
			scene.add(diamondMiddle);
			scene.add(diamondBottom);
		}
		
        // position and point the camera to the center of the scene
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 40;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // add the output of the renderer to the html element
        $(divId).append(webGLRenderer.domElement);

        render();
		
        function createMesh(geom) {

            // assign two materials
            var meshMaterial = new THREE.MeshNormalMaterial();
            meshMaterial.side = THREE.DoubleSide;
            var wireFrameMat = new THREE.MeshBasicMaterial();
            wireFrameMat.wireframe = true;

            // create a multimaterial
            var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);

            return mesh;
        }

		function render() {

			var timer = Date.now() * 0.0001;

			camera.position.x = Math.cos( timer ) * 10;
			camera.position.z = Math.sin( timer ) * 10;
			camera.lookAt( scene.position );
			requestAnimationFrame(render);
			webGLRenderer.render( scene, camera );

		}
	/**
	* Init stats
	*/
	function initStats() {

		var stats = new Stats();
		stats.setMode(0); // 0: fps, 1: ms

		// Align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

		$("#Stats-output").append(stats.domElement);

		return stats;
	}
}