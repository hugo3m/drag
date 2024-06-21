import * as BABYLON from "@babylonjs/core"

import { MATERIAL_BLUE, MATERIAL_GREEN, MATERIAL_GREY, MATERIAL_HIGHLIGHT, MATERIAL_RED, MATERIAL_WHITE } from "./contents/material";

import { App } from "./app";
import { DrawDebugSphere } from "./utils/debug";
import { Nullable } from "./utils/type";
import { RENDERING_LAYER } from "./utils/enum";

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
    // camera
    const CAMERA_TARGET = BABYLON.Vector3.Zero();
    const camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 15, CAMERA_TARGET, App.scene);
    camera.position = CAMERA_TARGET.add(new BABYLON.Vector3(10, 10, 10));
    camera.lowerBetaLimit = 0.1;
	camera.upperBetaLimit = (Math.PI / 2) * 0.9;
	camera.lowerRadiusLimit = 5;
	camera.upperRadiusLimit = 25;
    camera.attachControl(App.canvas, true);
    // light
    const light: BABYLON.DirectionalLight = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-0.3, -1, -0.3), App.scene);
    light.intensity = 0.8;
    light.position = new BABYLON.Vector3(0, 30, 0);
    // ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:10, height:10}, App.scene);
    ground.renderingGroupId = RENDERING_LAYER.SCENE;
    ground.material = MATERIAL_GREY;
    // box
    const faceColors = new Array(6);
    faceColors[0] = new BABYLON.Color4(0, 0, 1, 1);
    faceColors[1] = new BABYLON.Color4(0, 0, 1, 1);
    faceColors[2] = new BABYLON.Color4(1, 0, 0, 1);
    faceColors[3] = new BABYLON.Color4(1, 0, 0, 1);
    faceColors[4] = new BABYLON.Color4(0, 1, 0, 1);
    faceColors[5] = new BABYLON.Color4(0, 1, 0, 1);
    const box = BABYLON.MeshBuilder.CreateBox(BOX_NAME, { width:1, height: 1, faceColors: faceColors}, App.scene);
    box.position.addInPlace(new BABYLON.Vector3(1, 1, 1));
    box.material = MATERIAL_WHITE;
    box.renderingGroupId = RENDERING_LAYER.SCENE;
    // shadow
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.addShadowCaster(box);

    const XAxisLine = BABYLON.MeshBuilder.CreateLines("xAxisLine", {points: [new BABYLON.Vector3(100, 0 , 0), new BABYLON.Vector3(-100, 0 , 0)]}, App.scene);
    XAxisLine.renderingGroupId = RENDERING_LAYER.SCENE;
    XAxisLine.material = MATERIAL_RED.clone('material_red_xaxisline');

    const YAxisLine = BABYLON.MeshBuilder.CreateLines("YAxisLine", {points: [new BABYLON.Vector3(0, 100, 0), new BABYLON.Vector3(0, -100, 0)]}, App.scene);
    YAxisLine.renderingGroupId = RENDERING_LAYER.SCENE;
    YAxisLine.material = MATERIAL_GREEN.clone('material_green_yaxislien');

    const ZAxisLine = BABYLON.MeshBuilder.CreateLines("ZAxisLine", {points: [new BABYLON.Vector3(0, 0, 100), new BABYLON.Vector3(0, 0, -100)]}, App.scene);
    ZAxisLine.renderingGroupId = RENDERING_LAYER.SCENE;
    ZAxisLine.material = MATERIAL_BLUE.clone('material_blue_zaxisline');

    const box_axes = new BABYLON.AxesViewer(App.scene, undefined, RENDERING_LAYER.UI_SCENE, undefined, undefined, undefined, 2);
    box_axes.xAxis.parent = box;
    box_axes.yAxis.parent = box;
    box_axes.zAxis.parent = box;
    SetId(box_axes.xAxis, BOX_RIGHTAXIS_NAME);
    SetId(box_axes.yAxis, BOX_UPAXIS_NAME);
    SetId(box_axes.zAxis, BOX_FORWARDAXIS_NAME);
    box_axes.xAxis.getChildMeshes().forEach(mesh => mesh.material = GetColor(mesh.id).clone('xAxisDefaultMesh'));
    box_axes.yAxis.getChildMeshes().forEach(mesh => mesh.material = GetColor(mesh.id).clone('yAxisDefaultMesh'));
    box_axes.zAxis.getChildMeshes().forEach(mesh => mesh.material = GetColor(mesh.id).clone('zAxisDefaultMesh'));


    ground.receiveShadows = true;

    let pickedInfo: PickedInfo | null = null;

    App.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				pickedInfo = OnPointerDown();
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
                if (pickedInfo){
                    setTimeout(() => {
                        App.scene.activeCamera.attachControl(App.canvas, true);
                    }, 0);
                    App.scene.getMeshesById(pickedInfo.mesh.id).forEach(mesh => {delete mesh.material; mesh.material = GetColor(mesh.id);});
                    pickedInfo = null;
                }
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
                OnPointerMove(pickedInfo, box);
				break;
        }
    });


    App.start();
}



function OnPointerDown(): PickedInfo | null{
    const pickInfo = App.scene.pick(App.scene.pointerX, App.scene.pointerY, (mesh: BABYLON.Mesh) => [BOX_FORWARDAXIS_NAME, BOX_RIGHTAXIS_NAME, BOX_UPAXIS_NAME].includes(mesh.id));
    console.log(pickInfo.hit);
    let pickedInfo: PickedInfo = null;
    if (pickInfo && pickInfo.hit) {
        pickedInfo = {mesh: pickInfo.pickedMesh, startPoint: pickInfo.pickedPoint};
        App.scene.getMeshesById(pickedInfo.mesh.id).forEach(mesh => mesh.material = MATERIAL_HIGHLIGHT.clone('HIGHLIGHT'));
        setTimeout(() => {
            App.scene.activeCamera.detachControl(App.canvas);
        }, 0);
    }
    return pickedInfo;
}


function OnPointerMove(pickedInfo: PickedInfo | null, toMove: BABYLON.AbstractMesh){
    if (!pickedInfo) return;
    const Ray: BABYLON.Ray = App.scene.createPickingRay(App.scene.pointerX, App.scene.pointerY, null, App.scene.activeCamera);
    const Drag: Nullable<Dragging> = GetDragAxis(pickedInfo.mesh.id, toMove);
    if (!Drag) return;
    const dotDirOther = Math.abs(Drag.other.dot(Ray.direction.normalize()));
    const dorDirOother = Math.abs(Drag.oother.dot(Ray.direction.normalize()));
    const norm: BABYLON.Vector3 = dotDirOther > dorDirOother ? Drag.other :  Drag.oother;
    const plane: BABYLON.Plane = BABYLON.Plane.FromPositionAndNormal(pickedInfo.startPoint, norm);
    const intersectionDistance: number = Ray.intersectsPlane(plane);
    if(intersectionDistance)
    {
        const IntersectionRayPlane: BABYLON.Vector3 = new BABYLON.Vector3(Ray.origin.x + Ray.direction.x * intersectionDistance, Ray.origin.y + Ray.direction.y * intersectionDistance, Ray.origin.z + Ray.direction.z * intersectionDistance);
        const MouseDirection: BABYLON.Vector3 = IntersectionRayPlane.subtract(pickedInfo.startPoint);
        const DotToDragAxis: number = Drag.drag.dot(MouseDirection);
        const Diff = new BABYLON.Vector3(Drag.drag.x * DotToDragAxis, Drag.drag.y * DotToDragAxis, Drag.drag.z * DotToDragAxis);
        toMove.position.addInPlace(Diff);
        const NewStartPoint: BABYLON.Vector3 = Diff.add(pickedInfo.startPoint);
        pickedInfo.startPoint = NewStartPoint;
        DrawDebugSphere(NewStartPoint, 1000);
    }

}


function GetDragAxis(id: string, toMove: BABYLON.AbstractMesh): Nullable<Dragging>{
    switch(id){
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

function GetColor(id: string): BABYLON.Material {
    switch(id){
        case BOX_RIGHTAXIS_NAME:
            return MATERIAL_RED;
        case BOX_UPAXIS_NAME:
            return MATERIAL_GREEN;
        case BOX_FORWARDAXIS_NAME:
            return MATERIAL_BLUE;
        default:
            return null;
    }
}

function SetId(node: BABYLON.TransformNode, id: string){
    node.id = id;
    node.getChildMeshes().forEach(mesh => mesh.id = id);
}

main();