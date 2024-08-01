import * as BABYLON from "@babylonjs/core";

import { AXIS_ORIENT } from "../utils/enum";
import Entity from "./entity";
import { Nullable } from "../utils/type";
import { App } from "../app";
import { MATERIAL_BLUE, MATERIAL_GREEN, MATERIAL_HIGHLIGHT, MATERIAL_RED } from "../contents/material";
import { debugDrawPlane, debugDrawSphere } from "../utils/debug";

interface Dragging {
    drag: BABYLON.Vector3,
    other: BABYLON.Vector3,
    oother: BABYLON.Vector3
}

interface Pick {
    plane: BABYLON.Plane;
    startPoint: BABYLON.Vector3;
    debugPlane: Nullable<BABYLON.Mesh>;
}

class EAxis extends Entity {

    // orientation of the axis
    _orientation: AXIS_ORIENT;
    // entity to drag
    _attachEntity: Entity;
    // current pick
    _picking: Nullable<Pick>;


    constructor(root: BABYLON.TransformNode, defaultMaterial: BABYLON.Material, attachEntity: Entity, orientation: AXIS_ORIENT){
        super(root, defaultMaterial);
        this._attachEntity = attachEntity;
        this._orientation = orientation;
    }

    private _getAxisMaterial(axis: BABYLON.Vector3): BABYLON.Material
    {
        const rootAttachMesh = this._attachEntity._root;
        switch(axis){
            case rootAttachMesh.right:
                return MATERIAL_RED;
            case rootAttachMesh.up:
                return MATERIAL_GREEN;
            case rootAttachMesh.forward:
                return MATERIAL_BLUE;
            default:
                return this._defaultMaterial;
        }
    }

    /**
     * Get all 3 drag axis according to the current axis
     * @returns {Dragging} drag axis
     */
    private get _dragAxis(): Dragging{
        const rootAttachMesh = this._attachEntity._root;
        switch(this._orientation){
            case AXIS_ORIENT.X_AXIS:
                return {drag: rootAttachMesh.right, other: rootAttachMesh.up, oother: rootAttachMesh.forward}
            case AXIS_ORIENT.Y_AXIS:
                return {drag: rootAttachMesh.up, other: rootAttachMesh.right, oother: rootAttachMesh.forward};
            case AXIS_ORIENT.Z_AXIS:
                return {drag: rootAttachMesh.forward, other: rootAttachMesh.right, oother: rootAttachMesh.up};
        }
    }

    public override onPointerDown(pick: BABYLON.PickingInfo): void {
        // ==== define the plane to drag on
        // ray cast from the pointer
        const Ray: BABYLON.Ray = App.scene.createPickingRay(App.scene.pointerX, App.scene.pointerY, null, App.scene.activeCamera);
        // retrieve all 3 axis
        const Drag: Nullable<Dragging> = this._dragAxis;
        // dot product between the ray and the other axis
        const dotDirOther = Math.abs(Drag.other.dot(Ray.direction.normalize()));
        const dorDirOother = Math.abs(Drag.oother.dot(Ray.direction.normalize()));
        // choose a normal vector for the plane according to which axis the ray is closer to
        const norm: BABYLON.Vector3 = dotDirOther > dorDirOother ? Drag.other :  Drag.oother;
        // build the plane
        const plane: BABYLON.Plane = BABYLON.Plane.FromPositionAndNormal(pick.pickedPoint, norm);
        // ==== store data
        const debugPlane = debugDrawPlane(pick.pickedPoint, plane, null, this._getAxisMaterial(norm));
        this._picking = { plane: plane, startPoint: pick.pickedPoint, debugPlane: debugPlane };
        this._meshes.forEach(mesh => mesh.material = MATERIAL_HIGHLIGHT);
        // ==== remove control from moving camera
        setTimeout(() => {
            App.scene.activeCamera.detachControl(App.canvas);
        }, 0);
    }

    public override onPointerEnter(): void {
        // highlight the axis when pointer enter
        this.meshes.forEach(mesh => mesh.material = MATERIAL_HIGHLIGHT);
    }

    public override onPointerLeave(): void {
        // back to default when pointer leave
        this.meshes.forEach(mesh => mesh.material = this._defaultMaterial);
    }

    public override onPointerMove(): void {
        if(!this._picking) return;
        // else if we are holding an axis
        // create a ray from the mouse
        const Ray: BABYLON.Ray = App.scene.createPickingRay(App.scene.pointerX, App.scene.pointerY, null, App.scene.activeCamera);
        // find intersection with the plane
        const intersectionDistance: number = Ray.intersectsPlane(this._picking.plane);
        // if intersects
        if(intersectionDistance)
        {
            // find intersection on the plane
            const IntersectionRayPlane: BABYLON.Vector3 = new BABYLON.Vector3(Ray.origin.x + Ray.direction.x * intersectionDistance, Ray.origin.y + Ray.direction.y * intersectionDistance, Ray.origin.z + Ray.direction.z * intersectionDistance);
            debugDrawSphere(IntersectionRayPlane, 1000, MATERIAL_HIGHLIGHT);
            // direction from the pick point to the point on the plane
            const MouseDirection: BABYLON.Vector3 = IntersectionRayPlane.subtract(this._picking.startPoint);
            // retrieve the axis to drag on
            const DragAxis: BABYLON.Vector3 =  this._dragAxis.drag;
            // project the mouse direction on the axis
            const DotToDragAxis: number = DragAxis.dot(MouseDirection);
            // from direction get the actual vector to the new point
            const Diff = new BABYLON.Vector3(DragAxis.x * DotToDragAxis, DragAxis.y * DotToDragAxis, DragAxis.z * DotToDragAxis);
            // add vector to the position
            this._attachEntity._root.position.addInPlace(Diff);
            // define a new start point
            const NewStartPoint: BABYLON.Vector3 = Diff.add(this._picking.startPoint);
            this._picking.startPoint = NewStartPoint;
            // draw sphere
            debugDrawSphere(NewStartPoint, 1000, this._defaultMaterial);
        }
        return null;
    }

    public override onPointerUp(): void {
        if(!this._picking) return;
        this.meshes.forEach(mesh => mesh.material = this._defaultMaterial);
        setTimeout(() => {
            App.scene.activeCamera.attachControl(App.canvas, true);
        }, 0);
        if(this._picking.debugPlane !== null)
        {
            App.scene.removeMesh(this._picking.debugPlane);
        }
        this._picking = null;
    }

}

export default EAxis;