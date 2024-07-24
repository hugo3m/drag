import * as BABYLON from "@babylonjs/core";

import { AXIS_ORIENT } from "../utils/enum";
import Entity from "./entity";
import { Nullable } from "../utils/type";
import { App } from "../app";
import { MATERIAL_HIGHLIGHT } from "../contents/material";

interface Dragging {
    drag: BABYLON.Vector3,
    other: BABYLON.Vector3,
    oother: BABYLON.Vector3
}

interface Pick {
    plane: BABYLON.Plane;
    startPoint: BABYLON.Vector3;
}

class EAxis extends Entity {

    _orientation: AXIS_ORIENT;
    _attachEntity: Entity;
    _picking: Pick;


    constructor(root: BABYLON.TransformNode, defaultMaterial: BABYLON.Material, attachEntity: Entity, orientation: AXIS_ORIENT){
        super(root, defaultMaterial);
        this._attachEntity = attachEntity;
        this._orientation = orientation;
    }

    private getDragAxis(): Dragging{
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
        // ---- define plane
        const Ray: BABYLON.Ray = App.scene.createPickingRay(App.scene.pointerX, App.scene.pointerY, null, App.scene.activeCamera);
        const Drag: Nullable<Dragging> = this.getDragAxis();
        const dotDirOther = Math.abs(Drag.other.dot(Ray.direction.normalize()));
        const dorDirOother = Math.abs(Drag.oother.dot(Ray.direction.normalize()));
        const norm: BABYLON.Vector3 = dotDirOther > dorDirOother ? Drag.other :  Drag.oother;
        const plane: BABYLON.Plane = BABYLON.Plane.FromPositionAndNormal(pick.pickedPoint, norm);
        // ---- store data
        this._picking = { plane: plane, startPoint: pick.pickedPoint };
        this._meshes.forEach(mesh => mesh.material = MATERIAL_HIGHLIGHT);
        setTimeout(() => {
            App.scene.activeCamera.detachControl(App.canvas);
        }, 0);
    }

    public override onPointerEnter(): void {
        this.meshes.forEach(mesh => mesh.material = MATERIAL_HIGHLIGHT);
    }

    public override onPointerLeave(): void {
        this.meshes.forEach(mesh => mesh.material = this._defaultMaterial);
    }

    public override onPointerMove(): void {
        if(!this._picking) return;
        // else if we are holding an axis
        const Ray: BABYLON.Ray = App.scene.createPickingRay(App.scene.pointerX, App.scene.pointerY, null, App.scene.activeCamera);
        const intersectionDistance: number = Ray.intersectsPlane(this._picking.plane);
        if(intersectionDistance)
        {
            const IntersectionRayPlane: BABYLON.Vector3 = new BABYLON.Vector3(Ray.origin.x + Ray.direction.x * intersectionDistance, Ray.origin.y + Ray.direction.y * intersectionDistance, Ray.origin.z + Ray.direction.z * intersectionDistance);
            const MouseDirection: BABYLON.Vector3 = IntersectionRayPlane.subtract(this._picking.startPoint);
            const DragAxis: BABYLON.Vector3 =  this.getDragAxis().drag;
            const DotToDragAxis: number = DragAxis.dot(MouseDirection);
            const Diff = new BABYLON.Vector3(DragAxis.x * DotToDragAxis, DragAxis.y * DotToDragAxis, DragAxis.z * DotToDragAxis);
            this._attachEntity._root.position.addInPlace(Diff);
            const NewStartPoint: BABYLON.Vector3 = Diff.add(this._picking.startPoint);
            this._picking.startPoint = NewStartPoint;
            // debugDrawSphere(NewStartPoint, 1000);
        }
        return null;
    }

    public override onPointerUp(): void {
        if(!this._picking) return;
        this.meshes.forEach(mesh => mesh.material = this._defaultMaterial);
        setTimeout(() => {
            App.scene.activeCamera.attachControl(App.canvas, true);
        }, 0);
        this._picking = null;
    }

}

export default EAxis;