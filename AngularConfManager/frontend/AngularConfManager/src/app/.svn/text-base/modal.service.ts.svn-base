import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ModalService {
    // handles opening and closing modals
    // mostly just opening them, the modals primarily close themselves
    // the modal component subscribes to changes in this

    public popup = new Subject<any>();

    constructor() { }

    show(data) {
        this.popup.next({
            "cmd":"show",
            data
        });
    }

    hide(modalName:string) {
        this.popup.next({
            "element":modalName,
            "cmd":"hide"
        });
    }

    subscribe(val) {
        this.popup.subscribe(val);
    }
}
