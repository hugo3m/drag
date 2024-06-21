import * as BABYLON from "@babylonjs/core"

import { App } from '../app';
import { MATERIAL_RED_MAT } from "../contents/material";
import { Nullable } from "./type";
import { RENDERING_LAYER } from "./enum";

function DrawDebugSphere(position: BABYLON.Vector3, time: Nullable<number> = null){
    const sphere = BABYLON.CreateSphere("sphere", {diameter: 0.1}, App.scene);
    sphere.position = position;
    sphere.renderingGroupId = RENDERING_LAYER.DEBUG_SCENE;
    sphere.material = MATERIAL_RED_MAT.clone('debug_sphere_material');
    if(time){
        setTimeout(() => {
            App.scene.removeMesh(sphere);
        }, time)
    }
}

export { DrawDebugSphere }