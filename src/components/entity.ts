import * as BABYLON from "@babylonjs/core";

/**
 * Entity to handle event on scene
 */
class Entity {

    _id: number;
    _root: BABYLON.TransformNode;
    _meshes: BABYLON.AbstractMesh[] = [];
    _defaultMaterial: BABYLON.Material;

    constructor(root: BABYLON.TransformNode, defaultMaterial: BABYLON.Material){
        this._root = root;
        if(this._root instanceof BABYLON.AbstractMesh)
        {
            this._meshes.push(this._root);
        }
        this._meshes.push(...root.getChildMeshes());
        this._defaultMaterial = defaultMaterial;
        this._meshes.forEach(mesh => mesh.material = defaultMaterial);
    }


    public get rootMesh(): BABYLON.TransformNode{
        return this._root;
    }

    public get meshes(): BABYLON.AbstractMesh[] {
        return this._meshes;
    }

    public get defaultMaterial(): BABYLON.Material {
        return this._defaultMaterial;
    }

    public set id(value: number){
        this._id = value;
    }

    public get id(): number{
        return this._id;
    }

    // abstract method
    public onPointerDown(pick: BABYLON.PickingInfo): void{
        throw new Error(`onPointerDown is not defined from pick ${pick}`);
    };

    // abstract method
    public onPointerEnter(): void{
        throw new Error(`onPointerEnter is not defined`);
    };

    // abstract method
    public onPointerLeave(): void{
        throw new Error(`onPointerLeave is not defined`);
    };

    // abstract method
    public onPointerMove(): void{
        throw new Error(`onPointerMouve is not defined`);
    }

    // abstract method
    public onPointerUp(): void{
        throw new Error(`onPointerUp is not defined`);
    }

}

export default Entity;