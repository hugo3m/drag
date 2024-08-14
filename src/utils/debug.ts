import * as BABYLON from "@babylonjs/core"

import { App } from '../app';
import { Nullable } from "./type";
import { RENDERING_LAYER } from "./enum";

/**
 * Draw a debug sphere (similar to UE5)
 * @param {BABYLON.Vector3} position position to draw the sphere
 * @param {Nullable<number>} time time before removing the sphere
 * @returns {BABYLON.Mesh} the sphere mesh
 */
function debugDrawSphere(position: BABYLON.Vector3, time: Nullable<number> = null, material: Nullable<BABYLON.Material> = null): BABYLON.Mesh
{
    const sphere = BABYLON.CreateSphere("debug_sphere", {diameter: 0.1}, App.scene);
    sphere.position = position;
    sphere.renderingGroupId = RENDERING_LAYER.DEBUG_SCENE;
    if(material)
    {
        sphere.material = material.clone('debug_sphere_material');
    }
    sphere.material.alpha = 0.1;
    if(time)
    {
        setTimeout(() => {
            App.scene.removeMesh(sphere);
        }, time)
    }
    return sphere;
}

/**
 * Draw a debug plane (similar to UE5)
 * @param {BABYLON.Vector3} position position to draw the sphere
 * @param {BABYLON.Plane} abstractPlane plane to draw
 * @param {Nullable<number>} time time before removing the sphere
 * @returns {BABYLON.Mesh} the plane mesh
 */
function debugDrawPlane(position: BABYLON.Vector3, abstractPlane: BABYLON.Plane, time: Nullable<number> = null, material: Nullable<BABYLON.Material> = null): BABYLON.Mesh
{
    const plane = BABYLON.MeshBuilder.CreatePlane("debug_plane", {sourcePlane: abstractPlane, width: 20, height: 20, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
    plane.position = position;
    plane.renderingGroupId = RENDERING_LAYER.DEBUG_SCENE;
    if(material)
    {
        plane.material = material.clone('debug_plane_material');
    }
    plane.material.alpha = 0.25;
    if(time)
    {
        setTimeout(() => {
            App.scene.removeMesh(plane);
        }, time)
    }
    return plane;
}

export { debugDrawSphere, debugDrawPlane }