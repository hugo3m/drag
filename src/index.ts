import * as BABYLON from "@babylonjs/core"

import { App } from "./app";

function main(){
    var camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), App.scene);
    camera.attachControl(App.canvas, true);
    var light1: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), App.scene);
    var sphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, App.scene);
    App.start();
}

main();