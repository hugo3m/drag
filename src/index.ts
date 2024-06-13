import * as BABYLON from "@babylonjs/core"

import { App } from "./app";
import { Nullable } from "./type";
import { redMat } from "./material";

const BOX_NAME = 'BOX';
const BOX_RIGHTAXIS_NAME = `${BOX_NAME}_RIGHT`;
const BOX_UPAXIS_NAME = `${BOX_NAME}_UP`;
const BOX_FORWARDAXIS_NAME = `${BOX_NAME}_FORWARD`;

interface PickedInfo {
    mesh: BABYLON.AbstractMesh,
    startPoint: BABYLON.Vector3
}

interface Dragging {
    drag: BABYLON.Vector3,
    other: BABYLON.Vector3,
    oother: BABYLON.Vector3
}

function main(){
    const camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), App.scene);
    camera.attachControl(App.canvas, true);
    const light: BABYLON.HemisphericLight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), App.scene);

    const box = BABYLON.MeshBuilder.CreateBox(BOX_NAME, { width:1, height: 1 }, App.scene);
    const box_axes = new BABYLON.AxesViewer(App.scene);
    box_axes.xAxis.parent = box;
    box_axes.yAxis.parent = box;
    box_axes.zAxis.parent = box;
    SetName(BOX_RIGHTAXIS_NAME, box_axes.xAxis);
    SetName(BOX_UPAXIS_NAME, box_axes.yAxis);
    SetName(BOX_FORWARDAXIS_NAME, box_axes.zAxis);

    let pickedInfo: PickedInfo | null = null;

    App.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				pickedInfo = OnPointerDown(pointerInfo.pickInfo);
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
                if (pickedInfo) App.scene.activeCamera.attachControl(App.canvas, true);
                pickedInfo = null;
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
                OnPointerMove(pickedInfo, box);
				break;
        }
    });


    App.start();
}



function OnPointerDown(pickInfo: BABYLON.PickingInfo | null): PickedInfo | null{
    let pickedInfo: PickedInfo = null;
    if (pickInfo && pickInfo.hit) {
        pickedInfo = {mesh: pickInfo.pickedMesh, startPoint: pickInfo.pickedPoint};
        App.scene.activeCamera.detachControl(App.canvas);
    }
    return pickedInfo;
}

function GetDragAxis(name: string, toMove: BABYLON.AbstractMesh): Nullable<Dragging>{
    switch(name){
        case BOX_RIGHTAXIS_NAME:
            return {drag: toMove.right, other: toMove.up, oother: toMove.forward}
        case BOX_UPAXIS_NAME:
            return {drag: toMove.up, other: toMove.right, oother: toMove.forward};
        case BOX_FORWARDAXIS_NAME:
            return {drag: toMove.forward, other: toMove.right, oother: toMove.up};
        default:
            return null;
    }
}

function DrawDebugSphere(position: BABYLON.Vector3){
    const sphere = BABYLON.CreateSphere("sphere", {diameter: 0.1}, App.scene);
    sphere.position = position;
}


function OnPointerMove(pickedInfo: PickedInfo | null, toMove: BABYLON.AbstractMesh){
    if (!pickedInfo) return;
    const Ray: BABYLON.Ray = App.scene.createPickingRay(App.scene.pointerX, App.scene.pointerY, null, App.scene.activeCamera);
    const Drag: Nullable<Dragging> = GetDragAxis(pickedInfo.mesh.name, toMove);
    if (!Drag) return;
    const dotDirOther = Math.abs(Drag.other.dot(Ray.direction.normalize()));
    const dorDirOother = Math.abs(Drag.oother.dot(Ray.direction.normalize()));
    const norm: BABYLON.Vector3 = dotDirOther > dorDirOother ? Drag.other :  Drag.oother;
    const plane: BABYLON.Plane = BABYLON.Plane.FromPositionAndNormal(pickedInfo.startPoint, norm);
    const intersectionDistance: number = Ray.intersectsPlane(plane);
    if(intersectionDistance)
    {
        const IntersectionRayPlane: BABYLON.Vector3 = new BABYLON.Vector3(Ray.origin.x + Ray.direction.x * intersectionDistance, Ray.origin.y + Ray.direction.y * intersectionDistance, Ray.origin.z + Ray.direction.z * intersectionDistance);
        const DotToDragAxis: number = Drag.drag.dot(IntersectionRayPlane);
        const ProjOnDragAxis: BABYLON.Vector3 = new BABYLON.Vector3(Drag.drag.x * DotToDragAxis, Drag.drag.y * DotToDragAxis, Drag.drag.z * DotToDragAxis).add(toMove.position);
        DrawDebugSphere(ProjOnDragAxis);
        const Diff = ProjOnDragAxis.subtract(pickedInfo.startPoint)
        toMove.position.addInPlace(Diff);
        pickedInfo.startPoint = ProjOnDragAxis;
    }

}

function SetName(name: string, root: BABYLON.TransformNode){
    root.name = name;
    root.getChildMeshes().forEach(mesh => mesh.name = name);
}

main();