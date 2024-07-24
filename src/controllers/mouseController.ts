import { EPickingInfo, Nullable } from "../utils/type";

import { App } from "../app";

class MouseController {

    _picked: EPickingInfo = null;
    _hovered: EPickingInfo = null;

    private _setHover(value: Nullable<EPickingInfo>)
    {
        // if same value return
        if(value === this._hovered) return;
        // else if we have hovered, call onunhover
        if (this._hovered) this._hovered.entity.onPointerLeave();
        // set the new value
        this._hovered = value;
        // if new hovered call onhover
        if (this._hovered) this._hovered.entity.onPointerEnter();
    }

    private _setPick(pick: Nullable<EPickingInfo>)
    {
        if(this._picked) this._picked.entity.onPointerUp();
        this._picked = pick;
        if (this._picked)this._picked.entity.onPointerDown(pick);
    }

    onPointerDown(){
        this._setPick(App.pickPointer());
    }

    onPointerMove(){
        if(this._picked) this._picked.entity.onPointerMove();
        else
        {
            this._setHover(App.pickPointer());
        }
    }

    onPointerUp(){
        this._setPick(null);
    }

}

export default MouseController;