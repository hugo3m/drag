import * as BABYLON from "@babylonjs/core"

import { App } from '../app';
import { MATERIAL_RED } from "../contents/material";
import { Nullable } from "./type";
import { RENDERING_LAYER } from "./enum";

function debugDrawSphere(position: BABYLON.Vector3, time: Nullable<number> = null): BABYLON.Mesh
{
    const sphere = BABYLON.CreateSphere("debug_sphere", {diameter: 0.1}, App.scene);
    sphere.position = position;
    sphere.renderingGroupId = RENDERING_LAYER.DEBUG_SCENE;
    sphere.material = MATERIAL_RED.clone('debug_sphere_material');
    sphere.material.alpha = 0.1;
    if(time){
        setTimeout(() => {
            App.scene.removeMesh(sphere);
        }, time)
    }
    return sphere;
}

function debugDrawPlane(position: BABYLON.Vector3, abstractPlane: BABYLON.Plane, time: Nullable<number> = null, material: Nullable<BABYLON.Material> = null): BABYLON.Mesh
{
    const plane = BABYLON.MeshBuilder.CreatePlane("debug_plane", {sourcePlane: abstractPlane, width: 20, height: 20});
    plane.position = position;
    plane.renderingGroupId = RENDERING_LAYER.DEBUG_SCENE;
    if(material) {plane.material = material.clone('debug_plane_material'); }
    plane.material.alpha = 0.25;
    if(time){
        setTimeout(() => {
            App.scene.removeMesh(plane);
        }, time)
    }
    return plane;
}

export { debugDrawSphere, debugDrawPlane }