import { EPickingInfo, Nullable } from "../utils/type";

import { App } from "../app";

class MouseController {

    // picked info (with a click of the mouse)
    _picked: EPickingInfo = null;
    // hovered info (with the pointer of the mouse)
    _hovered: EPickingInfo = null;

    /**
     * Set hover value, handle null value
     * @param {Nullable<EPickingInfo>} value
     */
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

    /**
     * Set pick value, handle null value
     * @param {Nullable<EPickingInfo>} pick
     */
    private _setPick(pick: Nullable<EPickingInfo>)
    {
        // if we had previous value call pointer up
        if(this._picked)
        {
            this._picked.entity.onPointerUp();
        }
        // set the new value
        this._picked = pick;
        // if we have a new value call pointer down
        if (this._picked)
        {
            this._picked.entity.onPointerDown(pick);
        }
    }

    onPointerDown()
    {
        // set pick
        this._setPick(App.pickPointer());
    }

    onPointerMove(){
        // check if we had picked something
        if(this._picked)
        {
            // call move
            this._picked.entity.onPointerMove();
        }
        // else
        else
        {
            // call hover
            this._setHover(App.pickPointer());
        }
    }

    onPointerUp()
    {
        // reset pick
        this._setPick(null);
    }

}

export default MouseController;