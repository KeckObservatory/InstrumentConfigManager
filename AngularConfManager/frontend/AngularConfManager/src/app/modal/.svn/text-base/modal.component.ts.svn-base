import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modal.service';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { CommunicationService } from '../communication.service';
import { DataService } from '../data.service';


// This file includes a Component for each modal.
// They're fairly short and pretty much the same.

@Component({
    selector: 'add-modal-content',
    templateUrl: './add-modal.component.html',
})
export class AddModalContent {
    @Input() showAdd:boolean;

    @Input() text_values:any[] = [];
    @Input() selectValues:any[] = [];

    private _current:any = {};

    // function activates when current is set - it adds default values
    @Input( 'current' ) set current ( current: any ) {
       this._current = current;

       // uncomment for sanity check. I hate TypeScript
       // if (this.showAdd == false) { console.log("false")} else {console.log("not false")}
       // if (this.showAdd == true) { console.log("true")} else {console.log("not true")}


       if (this.showAdd == true) {
           // add new
           // console.log(this.text)
         // console.log("adding new")
           Object.keys(this._current.data.textEntryData).forEach(x => {
               // console.log(JSON.parse(JSON.stringify(x)));

               this.text_values.forEach(y => {
                   if (y.title == this._current.data.textEntryData[x].title) {
                       y.default = this._current.data.textEntryData[x].default;
                       y.name = x;
                     // console.log("add - set ", y)

                   }
                   // console.log(y, y.title, this._current.data.textEntryData[x].title)

               });

           });

           // console.log("breakpoint")
           // console.log(this._current.data.selectableData,this.selectValues)

           Object.keys(this._current.data.selectableData).forEach(x => {
               // console.log(JSON.parse(JSON.stringify(x)));

               this.selectValues.forEach(y => {
                   if (y.title == this._current.data.selectableData[x].title) {
                       y.default = this._current.data.selectableData[x].default;
                       y.name = x;
                     // console.log("add - set ", y)

                   }
               });

           });

       }
       else {
           // edit
           // console.log("editing")
           // console.log(JSON.parse(JSON.stringify(this._current)));

           this._current.configurations.forEach(conf => {
               // console.log(conf,conf.id,this._current.id)
               if (conf.id == this._current.id) {
                   // console.log("conf", JSON.parse(JSON.stringify(conf)));

                   // console.log(this.text)
                   Object.keys(this._current.data.textEntryData).forEach(x => {
                        // console.log(JSON.parse(JSON.stringify(this._current.data.textEntryData[x])));

                        let temp_x = JSON.parse(JSON.stringify(this._current.data.textEntryData[x]));


                        this.text_values.forEach(y => {
                           if (y.title === this._current.data.textEntryData[x].title) {
                               y.default = conf[x];
                               y.name = x;
                               // console.log("edit - set ", JSON.parse(JSON.stringify(this._current.data.textEntryData[x])), JSON.parse(JSON.stringify(y)))
                           }
                           // console.log(y, y.title, this._current.data.textEntryData[x].title)

                       });

                       this._current.data.textEntryData[x] = temp_x;


                   });

                   Object.keys(this._current.data.selectableData).forEach(x => {
                       // console.log(JSON.parse(JSON.stringify(this._current.data.selectableData[x])));
                       // awful workaround for these side effects
                       let temp_x = JSON.parse(JSON.stringify(this._current.data.selectableData[x]));

                       this.selectValues.forEach(y => {
                           if (y.title === this._current.data.selectableData[x].title) {
                               y.default = conf[x];
                               y.name = x;
                               // console.log("edit - set ", JSON.parse(JSON.stringify(this._current.data.selectableData[x])), JSON.parse(JSON.stringify(y)))

                           }
                       });

                       this._current.data.selectableData[x] = temp_x;

                   });
               }
           });
           // console.log("end of loop", JSON.parse(JSON.stringify(this._current)));
       }

       let temp_info =  {id:this._current.id};

       for (let x of this.text_values) {
           if (x.default !== "") {
               temp_info[x.name]=x.default;
           }
       }

       for (let x of this.selectValues) {
           if (x.default !== "") {
               temp_info[x.name]=x.default;
           }
       }

       // console.log(JSON.parse(JSON.stringify(this._current)));

       this._current.info = temp_info;
       // console.log(JSON.parse(JSON.stringify(this._current)));

       // console.log(this._current, this.text_values, this.selectValues, temp_info)

    }

    constructor(public activeModal: NgbActiveModal,
                private http:CommunicationService,
                private sharedCurrent:DataService) {}

    async addConfiguration() {
        let response = await this.http.addConfiguration(this._current);
        // this.sharedCurrent.set(response);
        this.activeModal.dismiss('Cross click');
    }

    async updateConfiguration() {
        let response = await this.http.updateConfiguration(this._current);
        // this.sharedCurrent.set(response);
        this.activeModal.dismiss('Cross click');
    }
}


@Component({
    selector: 'login-modal-content',
    templateUrl: './login-modal.component.html',
})
export class LoginModalContent {

    constructor(public activeModal: NgbActiveModal) {}

}

@Component({
    selector: 'delete-modal-content',
    templateUrl: './delete-modal.component.html',
})
export class DeleteModalContent {

    // function activates when current is set - it adds default values
    @Input() _current;

    constructor(public activeModal: NgbActiveModal,
                private http:CommunicationService) {}

    async deleteConfiguration() {
        let response = this.http.addConfiguration(this._current)
        this.activeModal.dismiss('Cross click');
    }

}



@Component({
    selector: 'app-modal',
    template: '<div></div>',
    styleUrls: ['./add-modal.component.css']

})
export class ModalComponent implements OnInit {

    closeResult: string;
    showAdd:boolean;
    current:any={};
    editID:string="";

    constructor(private modal:ModalService, private ngbModal:NgbModal ) { }

    ngOnInit() {
        this.modal.popup.subscribe(msg => {
          // console.log(msg)
            if (msg.data.name === "add") {
                if (msg.cmd === "show") {
                  // console.log("msg show", JSON.parse(JSON.stringify(msg)));
                    this.current = msg.data.data.current;
                    this.showAdd = msg.data.data.showAdd;

                    // for whatever reason, TypeScript won't accept
                    // setting a property to {}. it just doesn't do it.
                    if (this.showAdd) {
                        // delete this.current.info;
                        // this.current.info={"Configuration Name": ""};
                        // console.log("post loop", this.current.info)
                    }
                    else {
                        this.current.id = msg.data.data.id;
                      // console.log(this.current.id,msg.data.data.id)
                    }

                  // console.log("opening modal")
                    this.openAddModal();
                }
            }

            else if (msg.data.name === "login") {
                if (msg.cmd === "show") {
                    this.openLoginModal();
                }
            }

            else if (msg.data.name === "delete") {
                if (msg.cmd === "show") {
                    this.current = msg.data.data.current;

                    this.openDeleteModal();
                }
            }
        })

    }

    openAddModal() {
      // console.log("open modal", JSON.parse(JSON.stringify(this.current)));


        let modalRef = this.ngbModal.open(AddModalContent);
        modalRef.componentInstance.showAdd = new Object(this.showAdd);

        // converts the current data to arrays to preserve order
        // if we don't do this, Angular decides to alphabetically sort the
        // object for literally no reason at all
        let text_val = Object.values(this.current['data']['textEntryData']);
        let select_val = Object.values(this.current['data']['selectableData'])
        modalRef.componentInstance.text_values = new Object(text_val);
        modalRef.componentInstance.selectValues = new Object(select_val);

        // current needs to be passed last so the other things are defined
        // when it gets there for the default function


        modalRef.componentInstance.current = new Object(this.current);

      // console.log("finish open modal", JSON.parse(JSON.stringify(this.current)));

    }

    openLoginModal() {
        // just needs to open it - user will be directed away because of
        // lack of permissions
        const modalRef = this.ngbModal.open(AddModalContent);
    }


    openDeleteModal() {
        const modalRef = this.ngbModal.open(AddModalContent);
        modalRef.componentInstance.showAdd = this.showAdd;

        // converts the current data to arrays to preserve order
        // if we don't do this, Angular decides to alphabetically sort the
        // object for literally no reason at all
        let text_val = Object.values(this.current['data']['textEntryData']);
        let select_val = Object.values(this.current['data']['selectableData'])
        modalRef.componentInstance.text_values = text_val;
        modalRef.componentInstance.selectValues = select_val;

        // current needs to be passed last so the other things are defined
        // when it gets there for the default function
      // console.log(this.current);
        modalRef.componentInstance.current = this.current;

    }

}
