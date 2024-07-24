import * as BABYLON from "@babylonjs/core"

import { AXIS_ORIENT, RENDERING_LAYER } from "./utils/enum";
import { MATERIAL_BLUE, MATERIAL_FOCUS, MATERIAL_GREEN, MATERIAL_GREY, MATERIAL_HIGHLIGHT, MATERIAL_RED, MATERIAL_WHITE } from "./contents/material";
import { debugDrawPlane, debugDrawSphere } from "./utils/debug";

import { App } from "./app";
import EAxis from "./components/axis";
import Entity from "./components/entity";
import MouseController from "./controllers/mouseController";
import { Nullable } from "./utils/type";

const BOX_NAME = 'BOX';



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
    box.renderingGroupId = RENDERING_LAYER.SCENE;
    const eBox = new Entity(box, MATERIAL_WHITE);
    App.addEntity(eBox);
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
    const eXAxis = new EAxis(box_axes.xAxis, MATERIAL_RED.clone('eXAxis'), eBox, AXIS_ORIENT.X_AXIS);
    App.addEntity(eXAxis);

    box_axes.yAxis.parent = box;
    const eYAxis = new EAxis(box_axes.yAxis, MATERIAL_GREEN.clone('eYAxis'), eBox, AXIS_ORIENT.Y_AXIS);
    App.addEntity(eYAxis);

    box_axes.zAxis.parent = box;
    const eZAxis = new EAxis(box_axes.zAxis, MATERIAL_BLUE.clone('eZAxis'), eBox, AXIS_ORIENT.Z_AXIS);
    App.addEntity(eZAxis);



    box_axes.yAxis.getChildMeshes().forEach(mesh => mesh.material = MATERIAL_GREEN);

    box_axes.zAxis.getChildMeshes().forEach(mesh => mesh.material = MATERIAL_BLUE);


    ground.receiveShadows = true;

    const mouseController = new MouseController();

    App.scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				mouseController.onPointerDown();
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
                mouseController.onPointerUp();
				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
                mouseController.onPointerMove();
				break;
        }
    });


    App.start();
}

main();