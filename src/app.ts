import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

import * as BABYLON from "@babylonjs/core"

import { EPickingInfo, Nullable } from "./utils/type";

import EAxis from "./components/axis";
import Entity from "./components/entity";

class App {

    /**
     * @description unique App singleton _instance
     */
    static _instance: App;
    /**
     * @description scene holding entities
     */
    _scene: BABYLON.Scene;
    /**
     * @description canvas
     */
    _canvas: HTMLCanvasElement
    /**
     * @description engine
     */
    _engine: BABYLON.Engine

    _entities: Entity[] = [];

    _interactEntities: Entity[] = [];

    /**
     * @description returns the scene instance
     * @returns {BABYLON.Scene} scene instance
     */
    public static get scene(): BABYLON.Scene
    {
        return App.instance._scene;
    }

    /**
     * @description returns the HTML canvas element
     * @returns {HTMLCanvasElement} HTML canvas
     */
    public static get canvas(): HTMLCanvasElement
    {
        return App.instance._canvas;
    }

    /**
     * @description returns the engine
     * @returns {BABYLON.Engine} engine
     */
    public static get engine(): BABYLON.Engine
    {
        return App.instance._engine;
    }

    /**
     * @description returns the engine
     * @returns {Engine} engine
     */
    public static get entities(): Entity[]
    {
        return App.instance._entities;
    }

    /**
     * @description returns the engine
     * @returns {Engine} engine
     */
    public static get interactEntities(): Entity[]
    {
        return App.instance._interactEntities;
    }


    /**
     * @description returns the unique app instance
     * @returns {App} app instance
     */
    public static get instance(): App
    {
        if (!App._instance)
        {
            App._instance = new App();
        }

        return App._instance;
    }

    /**
     * @description start the app
     */
    public static start(): void
    {
        // run the main render loop
        App.engine.runRenderLoop(() => {
            App.scene.render();
        });
    }

    public static addEntity(entity: Entity){
        App.entities.push(entity);
        if(entity instanceof EAxis)
        {
            App.interactEntities.push(entity);
        }
    }

    public static pickPointer(): Nullable<EPickingInfo>{

        const interactMeshes: BABYLON.AbstractMesh[] = this.interactEntities.map(entity => entity._meshes).flat();
        const pick = App.scene.pick(App.scene.pointerX, App.scene.pointerY, (mesh) => interactMeshes.includes(mesh));
        if (pick && pick.hit)
        {
            let res: Nullable<Entity> = null;
            App.interactEntities.forEach(entity => {
                entity.meshes.forEach(eMesh => {
                    if(eMesh === pick.pickedMesh) res = entity;
                })
            })
            if(res) return {...pick, entity: res} as EPickingInfo;
        }
        return null;

    }

    public static findEntityFromMesh(mesh: BABYLON.AbstractMesh): Nullable<Entity>{
        let res: Nullable<Entity> = null;
        App.interactEntities.forEach(entity => {
            entity.meshes.forEach(eMesh => {
                if(eMesh === mesh) res = entity;
            })
        })
        return res;
    }


    private constructor()
    {
        // create the canvas html element and attach it to the webpage
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "babyloncanvas";
        document.body.appendChild(this._canvas);

        // initialize babylon scene and engine
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(this._engine);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

    }
}


export {App}