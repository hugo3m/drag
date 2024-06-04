import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

import { ArcRotateCamera, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

import { redMat } from "./material";

class App {

    /**
     * @description unique App singleton _instance
     */
    static _instance: App;
    /**
     * @description scene holding entities
     */
    _scene: Scene;
    /**
     * @description canvas
     */
    _canvas: HTMLCanvasElement
    /**
     * @description engine
     */
    _engine: Engine

    /**
     * @description returns the scene instance
     * @returns {Scene} scene instance
     */
    public static get scene(): Scene
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
     * @returns {Engine} engine
     */
    public static get engine(): Engine
    {
        return App.instance._engine;
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


    private constructor()
    {
        // create the canvas html element and attach it to the webpage
        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "babyloncanvas";
        document.body.appendChild(this._canvas);

        // initialize babylon scene and engine
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

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


export {App} ;