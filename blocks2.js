var cubeTranslation2 = 0.0;
var obstacle2_num = 10;
var life_flag1 = 0;

function initBuffers2(gl) {

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var val_assgn = {'X1': 2.5, 'X2': 0.6, 'Y':2, 'Z':0.5};

  const blocks = [
    // Front face
    -val_assgn.X1, -val_assgn.Y,  val_assgn.Z,
    -val_assgn.X2, -val_assgn.Y,  val_assgn.Z,
    -val_assgn.X2,  val_assgn.Y,  val_assgn.Z,
    -val_assgn.X1,  val_assgn.Y,  val_assgn.Z,

    // Back face
    -val_assgn.X1, -val_assgn.Y, -val_assgn.Z,
    -val_assgn.X1,  val_assgn.Y, -val_assgn.Z,
    -val_assgn.X2,  val_assgn.Y, -val_assgn.Z,
    -val_assgn.X2, -val_assgn.Y, -val_assgn.Z,

    // Top face
    -val_assgn.X1,  val_assgn.Y, -val_assgn.Z,
    -val_assgn.X1,  val_assgn.Y,  val_assgn.Z,
    -val_assgn.X2,  val_assgn.Y,  val_assgn.Z,
    -val_assgn.X2,  val_assgn.Y, -val_assgn.Z,

    // Bottom face
    -val_assgn.X1, -val_assgn.Y, -val_assgn.Z,
    -val_assgn.X2, -val_assgn.Y, -val_assgn.Z,
    -val_assgn.X2, -val_assgn.Y,  val_assgn.Z,
    -val_assgn.X1, -val_assgn.Y,  val_assgn.Z,

    // Right face
    -val_assgn.X2, -val_assgn.Y, -val_assgn.Z,
    -val_assgn.X2,  val_assgn.Y, -val_assgn.Z,
    -val_assgn.X2,  val_assgn.Y,  val_assgn.Z,
    -val_assgn.X2, -val_assgn.Y,  val_assgn.Z,

    // Left face
    -val_assgn.X1, -val_assgn.Y, -val_assgn.Z,
    -val_assgn.X1, -val_assgn.Y,  val_assgn.Z,
    -val_assgn.X1,  val_assgn.Y,  val_assgn.Z,
    -val_assgn.X1,  val_assgn.Y, -val_assgn.Z,

    val_assgn.X1, -val_assgn.Y,  val_assgn.Z,
    val_assgn.X2, -val_assgn.Y,  val_assgn.Z,
    val_assgn.X2,  val_assgn.Y,  val_assgn.Z,
    val_assgn.X1,  val_assgn.Y,  val_assgn.Z,

    // Back face
    val_assgn.X1, -val_assgn.Y, -val_assgn.Z,
    val_assgn.X1,  val_assgn.Y, -val_assgn.Z,
    val_assgn.X2,  val_assgn.Y, -val_assgn.Z,
    val_assgn.X2, -val_assgn.Y, -val_assgn.Z,

    // Top face
    val_assgn.X1,  val_assgn.Y, -val_assgn.Z,
    val_assgn.X1,  val_assgn.Y,  val_assgn.Z,
    val_assgn.X2,  val_assgn.Y,  val_assgn.Z,
    val_assgn.X2,  val_assgn.Y, -val_assgn.Z,

    // Bottom face
    val_assgn.X1, -val_assgn.Y, -val_assgn.Z,
    val_assgn.X2, -val_assgn.Y, -val_assgn.Z,
    val_assgn.X2, -val_assgn.Y,  val_assgn.Z,
    val_assgn.X1, -val_assgn.Y,  val_assgn.Z,

    // Right face
    val_assgn.X2, -val_assgn.Y, -val_assgn.Z,
    val_assgn.X2,  val_assgn.Y, -val_assgn.Z,
    val_assgn.X2,  val_assgn.Y,  val_assgn.Z,
    val_assgn.X2, -val_assgn.Y,  val_assgn.Z,

    // Left face
    val_assgn.X1, -val_assgn.Y, -val_assgn.Z,
    val_assgn.X1, -val_assgn.Y,  val_assgn.Z,
    val_assgn.X1,  val_assgn.Y,  val_assgn.Z,
    val_assgn.X1,  val_assgn.Y, -val_assgn.Z,
  ];


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blocks), gl.STATIC_DRAW);


  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  var tp1_arr = [0.0,  0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
  var textureCoordinates = [];
  for(var itr =1;itr<=12;itr++)
  {
    textureCoordinates = textureCoordinates.concat(tp1_arr);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);


  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


  var indices = [];
  var cnt1 = {'Value':0};
  for(var itr = 1;itr<7;itr++)
  {
    for(var it =1 ;it<=3;it++)
    {
      indices = indices.concat(cnt1.Value);
      cnt1.Value += 1;
    }
    cnt1.Value -= 1;
    indices = indices.concat(cnt1.Value-2);
    for(var it =1 ;it<=2;it++)
    {
      indices = indices.concat(cnt1.Value);
      cnt1.Value += 1;
    }
  }

  var len = []; 
  len[0] = indices.length;
  for (i = 0 ; i < len[0]; i++) 
  {
    indices.push(indices[i]+24);
  }


  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}


var newTranslate=[],newRotate=[];
newTranslate[0]=-100, newRotate[0]=50;
var tp_len3 = [], val_arr = [-100,-200,-300,-400,-500,-600,-700,-800,-900,-1000];
tp_len3[0] = obstacle2_num;
var rot_arr = [50,70,90,110,130,150,170,190,210,230];
for(i=1;i < tp_len3[0];i++)
{
  newTranslate[i] = val_arr[i];
  newRotate[i] = rot_arr[i];
}

function drawScene2(gl, programInfo, buffers, texture, deltaTime) 
{
  
    const fieldOfView = 45 * Math.PI / 180;   
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
  
  
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);
  
    
    for(i=0;i<obstacle2_num;i++)
    {
      
      const modelViewMatrix = mat4.create();
  
      
      var attr = {'X':0.0,'Y':0.0,'Z':0.0};
      attr.X = 0.0;
      attr.Y = jump;
      attr.Z = cubeTranslation2+newTranslate[i];
      mat4.translate(modelViewMatrix,modelViewMatrix,[attr.X , attr.Y, attr.Z]);
      
      var attr1 = {'rot':0.0};
      attr1.rot = cubeRotation2+newRotate[i];
      mat4.rotate(modelViewMatrix,modelViewMatrix,attr1.rot,[0, 0, 1]);      
  

    var total_translate = cubeTranslation2+newTranslate[i];
    if(detect_collision_obstacle2(total_translate,cubeRotation,cubeRotation2,newRotate[i]))
    {
      
      newTranslate[i] += 10;
      
      if(flag == 1)
      {
        life_flag1 = 1
       
        for(var i = 1; i - 100 <100000073;i++){}
      }
     
    }
    if(life_flag1 == 1)
    {
      
      lives -= 1;
      console.log('Lives', lives);
      life_flag1 = 0;
    }
      
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
  
      
    {
      const num = 2; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many bytes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }
  
      
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  
      
      gl.useProgram(programInfo.program);
  
     
  
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.projectionMatrix,
          false,
          projectionMatrix);
      gl.uniformMatrix4fv(
          programInfo.uniformLocations.modelViewMatrix,
          false,
          modelViewMatrix);

      
      gl.activeTexture(gl.TEXTURE0);

      
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
    
      {
        const vertexCount = 72;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
      }
  
      
    }

    cubeRotation2 = rotation_check_obstacle1(level,cubeRotation2,deltaTime);
    cubeTranslation2 = frame_rate_obstacle2(cubeTranslation2,deltaTime);
  }

  function detect_collision_obstacle2(total_translate,cubeRotation,cubeRotation2,newrotation)
  {
    var temp = [];
    temp[0] = total_translate;
    temp[1] = cubeRotation;
    temp[2] = cubeRotation2;
    temp[3] = newrotation;
    var ext = {'min': -1.0,'max':0.0};
    if (temp[0] > ext.min && temp[0] < ext.max)
    {
      var num1 = []; 
      num1[0] = Math.floor((temp[2]+temp[3])*180.0/3.14 + 360)%360;
      num1[0] = num1[0]%180;
      var ext1 = {'min': 20,'max':170.0};
      if (!( num1[0] < ext1.min ||  num1[0] > ext1.max))  
      {
        return true;
      }
    }
  }

  function frame_rate_obstacle2(obstacle_translate, deltaTime)
  {
    var temp = [];
    temp[0] = obstacle_translate;
    temp[0] += deltaTime*20;
    if(temp[0] >= 1000)
    {
      temp[0]=0;
    }
    return temp[0];
  }

function rotation_check_obstacle2(level,rotation,deltaTime)
{
  var temp1 = [];
  temp1[0] = rotation;
  if(level > 1)
  {
    temp1[0] += deltaTime;
  }
  return temp1[0];
}
