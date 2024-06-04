import * as BABYLON from "@babylonjs/core";

import { App } from './app';

const redMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("ground", App.scene);
redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
redMat.emissiveColor = BABYLON.Color3.Red();

export { redMat };


