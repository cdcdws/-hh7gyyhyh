var cubeRotation = 0.0;
var cubeTranslation = 0.0;
var tunnel_length = 100;
var color_type = 0;
var zrotate = 0.1;
var grayScala = false;
var flashScala = false;
var paused = 1;
var cubeRotation1 = 0.0;
var cubeRotation2 = 0.0;
var lives = 4;
var score = 0;
var level = 1;
var jump = 1;
var speed = 0;
var gravity = -0.05;
var flag = 1;
var pos = 0;
var positions = [];


main();

Mousetrap.bind('a', function () {

  var params = rotate_left(cubeRotation,cubeRotation1,cubeRotation2, zrotate);
  cubeRotation = params[0];
  cubeRotation1 = params[1];
  cubeRotation2 = params[2];
})

Mousetrap.bind('d', function () {

  var params = rotate_right(cubeRotation,cubeRotation1,cubeRotation2, zrotate);
  cubeRotation = params[0];
  cubeRotation1 = params[1];
  cubeRotation2 = params[2];
})

Mousetrap.bind('b', function () {
  grayScala = !grayScala
 
})

Mousetrap.bind('p', function () {
    paused = (paused + 1)%2;
})

Mousetrap.bind('space', function() {
  if (flag == 1) 
  {
    flag = 0;
    speed = -0.1;
    gravity = 0.005;
  }
});

function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    attribute vec4 aVertexColor;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform bool flashScala;

    varying highp vec3 vLighting;
    varying highp vec2 vTextureCoord;
    varying lowp vec4 vColor;


		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
			vTextureCoord = aTextureCoord;

			
      highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);
      if (flashScala) {
        directionalLightColor = vec3(1.5, 1.5, 1.5);        
      }
      
      highp vec3 ambientLight = vec3(0.4, 0.4, 0.4);
			highp vec3 directionalVector = normalize(vec3(0, -1.5, 10));

			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

			highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
			vLighting = ambientLight + (directionalLightColor * directional);
		}
  `;

  // Fragment shader program

  const fsSource = `
		precision mediump float;
		varying highp vec2 vTextureCoord;
		varying highp vec3 vLighting;
		
		uniform sampler2D uSampler;
    uniform float now;
    uniform bool grayScala;
		
		vec4 toGrayscale(in vec4 color) {
			float average = (color.r + color.g + color.b) / 3.0;
			return vec4(average, average, average, 1.0);
			
		}
		
		vec4 colorize(in vec4 grayscale, in vec4 color) {
			return (grayscale * color);
		}
		
		float modI(float a,float b) {
			float m=a-floor((a+0.5)/b)*b;
		    return floor(m+0.5);
		}
		
		void main(void) {
			
			highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
			
      if (grayScala)
      {		
				gl_FragColor = toGrayscale(vec4(texelColor.rgb * vLighting, texelColor.a)); 	

			}
			else {
				gl_FragColor = vec4(texelColor.rgb *vLighting, texelColor.a);
			}
		}
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),

    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      grayScala: gl.getUniformLocation(shaderProgram, 'grayScala'),
      flashScala: gl.getUniformLocation(shaderProgram, 'flashScala'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers2 = initBuffers2(gl);
  const buffers1 = initBuffers1(gl);
  const buffers = initBuffers(gl);

  const texture = loadTexture(gl, 'timetunnel.jpg');
  const texture1 = loadTexture(gl, 'obs1.jpeg');
  const texture2 = loadTexture(gl, 'obs2.jpg');
  // const texture = loadTexture(gl, 'obs3.png');


  var then = 0;
  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    // x1 = Math.floor((Math.random() * 4));
    //x2 = 7 + Math.floor((Math.random() * 5));
    if(paused == 1)
    {
      score = Math.floor(now*10);
      level = Math.ceil(score/100);
      document.getElementById("score").innerHTML = score;
      document.getElementById("life").innerHTML = lives;
      document.getElementById("level").innerHTML = level;
      if(lives <=0)
      {
        document.getElementById("load").innerHTML = "<img src='gameover.jpg' alt='GAME OVER' class='center' height='550' width='720'/>"
      }

	    gl.uniform1i(programInfo.uniformLocations.flashScala, flashScala);
	    gl.uniform1i(programInfo.uniformLocations.grayScala, grayScala);
	    //console.log("IS scene drawn ??");
	    if (now%10 > 8) {
	      flashScala = true;
	    }
      else 
      {
	      flashScala = false;
	    }
	    
	    drawScene(gl, programInfo, buffers, texture, deltaTime);
      drawScene1(gl, programInfo, buffers1, texture1, deltaTime);
      drawScene2(gl, programInfo, buffers2, texture2, deltaTime);
      
	}

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.

  var count = 0,i,k;
  var angle = 0;
  var theta=(3.14159)/4;
  for(i=0;i<8;i++)
  {
      for(k=0;k<2;k++)
      {
          positions[count]= cal_cos(angle);
          count = count + 1;
          positions[count]= cal_sin(angle);
          count = count + 1;
          positions[count]= -2.0;
          count = count + 1;
          positions[count]= cal_cos(angle);
          count = count + 1;
          positions[count]= cal_sin(angle);
          count = count + 1;
          positions[count]=-6.0;
          count = count + 1;
          angle = cal_angle_increment(angle,theta);
      }
      angle = cal_angle_decrement(angle,theta);
  }
  var len = Array(1);
  len[0] = positions.length;

  for (var j = 0; j < tunnel_length; j++) 
  {
    for (var i = 0; i < len[0]; i+=3 ) 
    {
      tp1 = positions[i];
      position_push(tp1);
      tp2 = positions[i+1];
      position_push(tp2);
      tp3 = positions[i+2]-4*(j+1);
      position_push(tp3);
    }
  }


  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  //-------------------------------------------------------------------------------------------------
  
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  var arr = []
  arr[0] = [5.656850496748460, 2.343141997766190, 0];
  arr[1] = [2.343149503244498, 5.656847387874637, 0];
  arr[2] = [-2.343134492283756, 5.65685360561233, 0];
  arr[3] = [-5.656844278990856, 2.34315700871868, 0];
  arr[4] = [-5.65685671446623, -2.343126986797201, 0];
  arr[5] = [-2.34316451418874, -5.656841170097116, 0];
  arr[6] = [ 2.343119481306521, -5.656859823310183, 0];
  arr[7] = [5.656838061193419, -2.343172019654669, 0];
  var vertexFaceNormals = [];
  var itr = 0, itr1 = 0;
  for(itr = 0; itr<8;itr++)
  {
    for(itr1 = 1;itr1<=4;itr1++)
    {
      vertexFaceNormals = vertexFaceNormals.concat(arr[itr]);
    }
  }

  
  var vertexNormals = [];

  for (var i = 0; i < tunnel_length; i++) 
  {
    vertexNormals = vertexNormals.concat(vertexFaceNormals);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);


  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  
  var arr1 = [];
  arr1[0] = [0.0,  0.0, 1.0,  0.0, 1.0,  1.0, 0.0,  1.0];
  arr1[1] = [1.0,  0.0, 1.0,  1.0, 0.0,  1.0, 0.0,  0.0];
  arr1[2] = [1.0,  1.0, 0.0,  1.0, 0.0,  0.0, 1.0,  0.0];
  arr1[3] = [0.0,  1.0, 0.0,  0.0, 1.0,  0.0, 1.0,  1.0];

  var faceTextureCoordinates = [];
  for(var itr = 0;itr<4;itr++)
  {
    faceTextureCoordinates.push(arr1[itr]);
  }
  var temp = faceTextureCoordinates;
  faceTextureCoordinates = faceTextureCoordinates.concat(temp);
	
	var textureCoordinates = [];

  var tp_len = []
  tp_len[0] = faceTextureCoordinates.length;
  for (var j = 0; j < tunnel_length; j++) 
  {
    for (i = 0; i < tp_len[0]; i++)
    {
			textureCoordinates = textureCoordinates.concat(faceTextureCoordinates[i]);
		}
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
  
  
  // Calculate indices buffer
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


  var indices = [];
  var cnt = {'Value':0};
  for(var itr = 1;itr<9;itr++)
  {
    for(var it =1 ;it<=3;it++)
    {
      indices = indices.concat(cnt.Value);
      cnt.Value += 1;
    }
    cnt.Value -= 2;
    for(var it =1 ;it<=3;it++)
    {
      indices = indices.concat(cnt.Value);
      cnt.Value += 1;
    }
  }

  var len = []; 
  len[0] = indices.length;
  for (j = 0; j < tunnel_length; j++) 
  {
    for (i = 0 ; i < len[0] ; i++) 
    {
      var tp_val = indices[i]+(32*(j+1));
      indices.push(tp_val);
    }
  }

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    normal: normalBuffer,
    textureCoord: textureCoordBuffer,   
    indices: indexBuffer,
  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.


  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  var attr = {'X':0.0,'Y':0.0,'Z':0.0};
  attr.X = 0.0;
  attr.Y = jump;
  attr.Z = cubeTranslation;

  mat4.translate(modelViewMatrix,     // destination matrix
          modelViewMatrix,            // matrix to translate
          [attr.X , attr.Y, attr.Z]);

  mat4.rotate(modelViewMatrix,  // destination matrix
          modelViewMatrix,      // matrix to rotate
          cubeRotation,         // amount to rotate in radians
          [0, 0, 1]);           // axis to rotate around (Z)

  
  const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);
  
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 2;              
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
   
    gl.vertexAttribPointer(
        // programInfo.attribLocations.vertexColor,
        programInfo.attribLocations.textureCoord,         
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }


  // Tell WebGL how to pull out the texture coordinates from
  // the texture coordinate buffer into the textureCoord attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.textureCoord);
  }

  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexNormal,
      numComponents,
      type,
      normalize,
      stride,
      offset);
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexNormal);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix);
    
    // Texture Code 
    //---------------------------------------------------------------------------------
    gl.activeTexture(gl.TEXTURE0);                                                    -
                                                                                      
      // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
      // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    //--------------------------------------------------------------------------------


  {
    const vertexCount = 48*tunnel_length;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw
  cubeTranslation = frame_rate(cubeTranslation,deltaTime,level);
 //cubeRotation += deltaTime;
  
  if(flag == 0)
  {
    pos += speed;
    speed += gravity;
    jump = 1 + pos;
    if(pos >= 0)
    {
      flag = 1;
    }
  }
  
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}


function loadTexture(gl, url) 
{
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) 
{
  return (value & (value - 1)) == 0;
}

function cal_cos(rad)
{
  var tp = 2*Math.cos(rad);
  return tp;
}

function cal_sin(rad)
{
  var tp = 2*Math.sin(rad);
  return tp;
}

function cal_angle_increment(rad,omega)
{
  var tp2 = rad + omega;
  return tp2;
}

function cal_angle_decrement(rad,omega)
{
  var tp2 = rad - omega;
  return tp2;
}

function position_push(val)
{
  positions.push(val);
}

function frame_rate(tunnel_translate, deltaTime, level)
{
  var temp = [];
  temp[0] = tunnel_translate;
  temp[0] += deltaTime*20 + level/20;
  if(temp[0] >= 320)
  {
    temp[0]=0;
  }
  return temp[0];
}

function rotate_left(cubeRotation,cubeRotation1,cubeRotation2,delta)
{
  var temp = [];
  temp[0] = cubeRotation;
  temp[1] = cubeRotation1;
  temp[2] = cubeRotation2;
  temp[0] += delta;
  temp[1] += delta;
  temp[2] += delta;
  return temp;
}

function rotate_right(cubeRotation,cubeRotation1,cubeRotation2,delta)
{
  var temp = [];
  temp[0] = cubeRotation;
  temp[1] = cubeRotation1;
  temp[2] = cubeRotation2;
  temp[0] -= delta;
  temp[1] -= delta;
  temp[2] -= delta;
  return temp;
}
