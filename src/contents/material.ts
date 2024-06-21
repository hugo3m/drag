import * as BABYLON from "@babylonjs/core";

import { App } from '../app';

// redMat
const MATERIAL_RED_MAT: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("redMat", App.scene);
MATERIAL_RED_MAT.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
MATERIAL_RED_MAT.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
MATERIAL_RED_MAT.emissiveColor = BABYLON.Color3.Red();

// grey
const MATERIAL_GREY: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("grey", App.scene);
MATERIAL_GREY.specularColor = BABYLON.Color3.Black();

// red
const MATERIAL_RED = new BABYLON.StandardMaterial("red", App.scene);
MATERIAL_RED.diffuseColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_RED.specularColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_RED.emissiveColor = BABYLON.Color3.Red();

// green
const MATERIAL_GREEN = new BABYLON.StandardMaterial("green", App.scene);
MATERIAL_GREEN.diffuseColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_GREEN.specularColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_GREEN.emissiveColor = BABYLON.Color3.Green();

// blue
const MATERIAL_BLUE = new BABYLON.StandardMaterial("blue", App.scene);
MATERIAL_BLUE.diffuseColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_BLUE.specularColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_BLUE.emissiveColor = BABYLON.Color3.Blue();

// white
const MATERIAL_WHITE = new BABYLON.StandardMaterial("white", App.scene);
MATERIAL_WHITE.diffuseColor = BABYLON.Color3.White();
MATERIAL_WHITE.specularColor = BABYLON.Color3.White();
MATERIAL_WHITE.emissiveColor = BABYLON.Color3.White();
MATERIAL_WHITE.alpha = 0.5;

// red shiny
const MATERIAL_HIGHLIGHT = new BABYLON.StandardMaterial("red_shiny", App.scene);
MATERIAL_HIGHLIGHT.diffuseColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_HIGHLIGHT.specularColor = new BABYLON.Color3(0, 0, 0);
MATERIAL_HIGHLIGHT.emissiveColor = BABYLON.Color3.Yellow();




export { MATERIAL_RED_MAT, MATERIAL_GREY, MATERIAL_RED, MATERIAL_BLUE, MATERIAL_GREEN, MATERIAL_WHITE, MATERIAL_HIGHLIGHT };


