import * as BABYLON from "@babylonjs/core";

import Entity from "src/components/entity";

type Nullable<T> = T | null;

type EPickingInfo = BABYLON.PickingInfo & { entity: Entity};

export { Nullable, EPickingInfo }