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
MATERIAL_RED.diffuseColor = BABYLON.Color3.Red();
MATERIAL_RED.specularColor = BABYLON.Color3.Red();
MATERIAL_RED.emissiveColor = BABYLON.Color3.Red();

// green
const MATERIAL_GREEN = new BABYLON.StandardMaterial("green", App.scene);
MATERIAL_GREEN.diffuseColor = BABYLON.Color3.Green();
MATERIAL_GREEN.specularColor = BABYLON.Color3.Green();
MATERIAL_GREEN.emissiveColor = BABYLON.Color3.Green();

// blue
const MATERIAL_BLUE = new BABYLON.StandardMaterial("blue", App.scene);
MATERIAL_BLUE.diffuseColor = BABYLON.Color3.Blue();
MATERIAL_BLUE.specularColor = BABYLON.Color3.Blue();
MATERIAL_BLUE.emissiveColor = BABYLON.Color3.Blue();


export { MATERIAL_RED_MAT, MATERIAL_GREY, MATERIAL_RED, MATERIAL_BLUE, MATERIAL_GREEN };


