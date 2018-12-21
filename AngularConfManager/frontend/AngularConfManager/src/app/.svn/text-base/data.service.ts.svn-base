import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    // this class handles sharing data between components
    // specifically, dataSource is changed to the current instrument data
    // each module that requires this data subscribe()s to the currentMessage

    dataSource = new BehaviorSubject({});
    currentMessage = this.dataSource.asObservable();

    constructor() { }

    set(message: Object) {
        this.dataSource.next(message);
      // console.log("cur set to: ", message);
    }

    get() {
        let val = this.dataSource.getValue();
      // console.log("retrieving cur: ", val)

        return val;
    }

    subscribe(val) {
      // console.log("external function subscribing on: ", val)
        return this.currentMessage.subscribe(val);
    }

}
