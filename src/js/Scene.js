"use strict";
let Scene = function(gl) {
  this.texturevsIdle = new Shader(gl, gl.VERTEX_SHADER, "texture_idle_vs.essl");
  this.texturefsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "texture_fs.essl");
  this.texturefsShadow = new Shader(gl, gl.FRAGMENT_SHADER, "shadow_fs.essl");
  this.texturefsMarble = new Shader(gl, gl.FRAGMENT_SHADER, "marble_fs.essl");
  this.texturefsWood = new Shader(gl, gl.FRAGMENT_SHADER, "wood_fs.essl");
  this.textureProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsSolid);
  this.shadowProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsShadow);
  this.uvMarbleProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsMarble);
  this.uvWoodProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsWood);

  this.texturefsMap = new Shader(gl, gl.FRAGMENT_SHADER, "envirMap_fs.essl");
  this.envirvsIdle = new Shader(gl, gl.VERTEX_SHADER, "envir_idle_vs.essl");
  this.envirfsSolid = new Shader(gl, gl.FRAGMENT_SHADER, "rayCasting_fs.essl");
  this.mapProgram = new TexturedProgram(gl,this.texturevsIdle,this.texturefsMap);
  this.envirProgram = new TexturedProgram(gl,this.envirvsIdle,this.envirfsSolid);

  this.gameObjects = [];
  this.shadowMaterial = new Material(gl, this.shadowProgram);

  //envir
  this.TexturedQuadGeometry = new TexturedQuadGeometry(gl);
  this.envirMaterial = new Material(gl, this.envirProgram);
  this.envirTexture = new Texture2D(gl, 'envmaps/milkyway.jpg');
  this.envirMaterial.probeTexture.set(this.envirTexture.glTexture);
  this.envirMesh = new Mesh(this.TexturedQuadGeometry,this.envirMaterial); 
  this.envirObject = new GameObject(this.envirMesh);
  this.envirObject.orientation = 3.14/2;
  this.envirObject.rotateAxis.set(1, 0, 0);


  this.clippedQuadricArray = [];
  //////////////board(1)
  let board = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  board.setBoard();
  board.transform(new Mat4().translate(0,.5,0.5));
  this.clippedQuadricArray.push(board);


  this.createKing();
  this.createQueen();
  this.createBishop();
  this.createRook();

  








  //////////////pawn(2)
  let sphere = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  sphere.setUnitSphere();
  sphere.transform(new Mat4().scale(.1).translate(0,2,0));
  this.clippedQuadricArray.push(sphere);
  //3
  let cone = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  cone.setCone();
  cone.transform(new Mat4().translate(0,2,0));
  this.clippedQuadricArray.push(cone);









  //material; update #
  let quadricsObjects = 32;

  this.brdfs = new Vec4Array(quadricsObjects);
  this.brdfs.at(0).set(0, 0, 0, 1); 
  for (var i = 1; i < quadricsObjects; i++){
    this.brdfs.at(i).set(.1, .6, .5, 1); 
  }

  this.lightSource = new LightSource();
  this.lightSource.lightPos = new Vec4Array(1);
  this.lightSource.lightPos.at(0).set(0.7,-1,1,0); // the last 0 indicates that it's a directional light
  this.lightSource.lightPowerDensity = new Vec4Array(1);
  this.lightSource.lightPowerDensity.at(0).set(1,1,1,1); 
  this.lightSource.mainDir = new Vec4(); 
  this.camera = new PerspectiveCamera();
  this.camera.position.set(0,2,2.9);
};


Scene.prototype.createKing = function(){
	 /////////////////King (7)
  let kingUpParaboloid = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingUpParaboloid.setKingUpParaboloid();
  kingUpParaboloid.transform(new Mat4().scale(.12).translate(.13,1.81,1.382));
  this.clippedQuadricArray.push(kingUpParaboloid);
  //8th
  let kingCrossV = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingCrossV.setCyclinder();
  kingCrossV.transformClipper(new Mat4().scale(1.8));
  kingCrossV.transform(new Mat4().scale(.08).translate(0.13,1.97,1.392));
  this.clippedQuadricArray.push(kingCrossV);
  //
  let kingCrossH = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingCrossH.setCyclinder();
  kingCrossH.transformClipper(new Mat4().scale(1.8));
  kingCrossH.transform(new Mat4().scale(.08).rotate(3.14/2).translate(0.13,1.97,1.392));
  this.clippedQuadricArray.push(kingCrossH);
  //8th
  let kingSmallCircleBase  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingSmallCircleBase.setKingSmallCircleBase();
  kingSmallCircleBase.transform(new Mat4().scale(0.08).translate(.13,1.75,1.382));
  this.clippedQuadricArray.push(kingSmallCircleBase);
  //9th //?
  let kingCyclinder  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingCyclinder.setCyclinder();
  kingCyclinder.transform(new Mat4().scale(0.1).translate(.13,1.79,1.382));
  this.clippedQuadricArray.push(kingCyclinder);
  //10th
  let kingDownHyperboloid = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingDownHyperboloid.setKingDownHyperboloid( );
  kingDownHyperboloid.transform(new Mat4().scale(0.3).translate(.13,1.73,1.382));
  kingDownHyperboloid.transformClipper(new Mat4().translate(0,-.09,0));
  this.clippedQuadricArray.push(kingDownHyperboloid);
  //11th
  let kingLargeCircleBase  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  kingLargeCircleBase.setKingLargeCircleBase();
  kingLargeCircleBase.transform(new Mat4().scale(0.115).translate(.13,1.53,1.386));
  this.clippedQuadricArray.push(kingLargeCircleBase);
}

Scene.prototype.createQueen = function(){
////////////Queen(12)
  let queenHyperboloid  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  queenHyperboloid.setHyperboloid();
  queenHyperboloid.transform(new Mat4().scale(0.3).translate(-.13,1.7,1.382));
  this.clippedQuadricArray.push(queenHyperboloid);
  //13th
  let queenSmallCircleBase  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  queenSmallCircleBase.setKingSmallCircleBase();
  queenSmallCircleBase.transform(new Mat4().scale(.075).translate(-0.13,1.72,1.382));
  this.clippedQuadricArray.push(queenSmallCircleBase);
  //14
  let queenLargeCircleBase  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  queenLargeCircleBase.setKingLargeCircleBase();
  queenLargeCircleBase.transform(new Mat4().scale(.115).translate(-.13,1.53,1.378));
  this.clippedQuadricArray.push(queenLargeCircleBase);
  //15
  let queenBall = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  queenBall.setUnitSphere();
  queenBall.transform(new Mat4().scale(.06).translate(-.13,1.94,1.382));
  this.clippedQuadricArray.push(queenBall);
}

Scene.prototype.createBishop = function(){
	///////////////////bishop(4)
  let bishopSphereF1 = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  bishopSphereF1.setBishopSphere()
  bishopSphereF1.transform(new Mat4().scale(.07).translate(.38,1.71,1.37));
  bishopSphereF1.transformClipper(new Mat4().translate(.02,.017,0));
  this.clippedQuadricArray.push(bishopSphereF1);
  //5
  let bishopConeF1 = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  bishopConeF1.setCone();
  bishopConeF1.transform(new Mat4().scale(0.7).translate(.38,1.71,1.37));
  this.clippedQuadricArray.push(bishopConeF1);
  //
  let bishopSphereC1 = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  bishopSphereC1.setBishopSphere()
  bishopSphereC1.transform(new Mat4().scale(.07).translate(-.37, 1.71,1.37));
  bishopSphereC1.transformClipper(new Mat4().translate(.02,.017,0));
  this.clippedQuadricArray.push(bishopSphereC1);
  //5
  let bishopConeC1 = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  bishopConeC1.setCone();
  bishopConeC1.transform(new Mat4().scale(0.7).translate(-.37,1.71,1.37));
  this.clippedQuadricArray.push(bishopConeC1);
}

Scene.prototype.createRook = function(){
  //////////////ROOK
  let rookCircleBaseA1  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  rookCircleBaseA1.setKingLargeCircleBase();
  rookCircleBaseA1.transform(new Mat4().scale(0.08).translate(-0.88,1.51,1.375));
  this.clippedQuadricArray.push(rookCircleBaseA1);
  //
  let rookHyperboloidA1  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  rookHyperboloidA1.setHyperboloid();
  rookHyperboloidA1.transform(new Mat4().scale(0.32).translate(-.88,1.65,1.375));
  rookHyperboloidA1.transformClipper(new Mat4().scale(0.4).translate(0,.95,0));
  this.clippedQuadricArray.push(rookHyperboloidA1);
  //
  let rookCircleA1  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  rookCircleA1.setKingSmallCircleBase();
  rookCircleA1.transform(new Mat4().scale(.08).translate(-0.88,1.69,1.375));
  this.clippedQuadricArray.push(rookCircleA1);
  ////
  let rookRecPrismA1a = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismA1a.setRecPrism();
  rookRecPrismA1a.transform(new Mat4().scale(0.014).translate(-0.916,1.712,1.375));
  this.clippedQuadricArray.push(rookRecPrismA1a);
  ////
  let rookRecPrismA1b = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismA1b.setRecPrism();
  rookRecPrismA1b.transform(new Mat4().scale(0.014).translate(-0.844,1.712,1.375));
  this.clippedQuadricArray.push(rookRecPrismA1b);
   ////
  let rookRecPrismA1c = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismA1c.setRecPrism();
  rookRecPrismA1c.transform(new Mat4().scale(0.014).translate(-0.879,1.712,1.34));
  this.clippedQuadricArray.push(rookRecPrismA1c);
   ////
  let rookRecPrismA1d = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismA1d.setRecPrism();
  rookRecPrismA1d.transform(new Mat4().scale(0.014).translate(-0.879,1.712,1.412));
  this.clippedQuadricArray.push(rookRecPrismA1d);

  //////////////////////
  let rookCircleBaseH1  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  rookCircleBaseH1.setKingLargeCircleBase();
  rookCircleBaseH1.transform(new Mat4().scale(0.08).translate(0.88,1.51,1.375));
  this.clippedQuadricArray.push(rookCircleBaseH1);
  //
  let rookHyperboloidH1  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  rookHyperboloidH1.setHyperboloid();
  rookHyperboloidH1.transform(new Mat4().scale(0.32).translate(.88,1.65,1.375));
  rookHyperboloidH1.transformClipper(new Mat4().scale(0.4).translate(0,.95,0));
  this.clippedQuadricArray.push(rookHyperboloidH1);
  //
  let rookCircleH1  = new ClippedQuadric(new Mat4(),new Mat4(),new Mat4());
  rookCircleH1.setKingSmallCircleBase();
  rookCircleH1.transform(new Mat4().scale(.08).translate(0.88,1.69,1.375));
  this.clippedQuadricArray.push(rookCircleH1);
	////
  let rookRecPrismH1a = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismH1a.setRecPrism();
  rookRecPrismH1a.transform(new Mat4().scale(0.014).translate(0.916,1.712,1.375));
  this.clippedQuadricArray.push(rookRecPrismH1a);
  ////
  let rookRecPrismH1b = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismH1b.setRecPrism();
  rookRecPrismH1b.transform(new Mat4().scale(0.014).translate(0.844,1.712,1.375));
  this.clippedQuadricArray.push(rookRecPrismH1b);
   ////
  let rookRecPrismH1c = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismH1c.setRecPrism();
  rookRecPrismH1c.transform(new Mat4().scale(0.014).translate(0.879,1.712,1.34));
  this.clippedQuadricArray.push(rookRecPrismH1c);
   ////
  let rookRecPrismH1d = new ClippedQuadric(new Mat4(),new Mat4(), new Mat4());
  rookRecPrismH1d.setRecPrism();
  rookRecPrismH1d.transform(new Mat4().scale(0.014).translate(0.879,1.712,1.412));
  this.clippedQuadricArray.push(rookRecPrismH1d);
}




Scene.prototype.update = function(gl, keysPressed) {  
  let timeAtThisFrame = new Date().getTime();
  let dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  let speed = 0.5;

  // clear the screen
  gl.clearColor(223/255, 208/255, 159/255, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  this.camera.move(dt, keysPressed);
  
  this.envirObject.draw(this.camera, this.lightSource, this.clippedQuadricArray, this.brdfs);


}




