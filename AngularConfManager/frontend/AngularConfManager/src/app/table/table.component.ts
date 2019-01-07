import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as data from '../json/instrumentConfData.json';
import * as config from '../json/config.json';
import { CommunicationService } from '../communication.service';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

    table_headings:string[] = [];
    current:any;
    configs:string[]=[];
    configIDs:string[]=[];

    subscription: Subscription;

    constructor(
        private http:CommunicationService,
        private sharedCurrent:DataService,
        private modal:ModalService
    ) { }

    ngOnInit() {
        // this.sharedCurrent.subscribe((val) => {
        //     this.current = val;
        //     this.table_headings = this.tableInit(this.current);
        // });

        this.subscription = this.sharedCurrent.currentMessage.subscribe((val) => {
            //console.log("table got current-val from subscription", val);
            if (val) {
                this.current = val;
                [this.table_headings, this.configs, this.configIDs] = this.tableInit(val);
            }
        });
    }

    tableInit(current) {
        //console.log(current, "from tableInit");
        let headers = [];
        if (current.configurations){
            for (let property of current.order){
                //console.log("property: ", property);
                if (property[0]=="textEntry") {
                    headers.push(current.data.textEntryData[property[1]].title);
                }
                else if (property[0]=="selectable") {
                    headers.push(current.data.selectableData[property[1]].title);
                }
            }

            let goodConfigurations = [];
            let configIDs = [];

            current.configurations.forEach(config => {
                let configuration = [];
                configIDs.push(config['id'])

                for (let property of current.order) {
                    configuration.push(config[property[1]]);
                }

                goodConfigurations.push(configuration);
            });

            //console.log("table init'd, ", headers, goodConfigurations);

            return [headers, goodConfigurations, configIDs];
        }

        return [[],[]];


    }

    editConfiguration(id) {
        this.current.info.id = id;
        this.modal.show({
            "name":"add",
            "data":{
                "current":this.current,
                "showAdd":false,
                "id":id,
            }
        });
    }
    async duplicateConfiguration(id) {
      // console.log("duplicate", id)
        this.current.info.id = id;
        let duplicate_response = await this.http.duplicateConfiguration(this.current);

      // console.log(duplicate_response)
        if (duplicate_response) {
            this.current.configurations = duplicate_response;
            this.sharedCurrent.set(this.current);
        }
    }
    async confirmDelete(id) {
      // console.log("delete", id)
        this.current.deleteConfigurationId = id;
        let delete_repsonse = await this.http.deleteConfiguration(this.current);

      // console.log(delete_repsonse)
        if (delete_repsonse) {
            this.current.configurations = delete_repsonse;
            this.sharedCurrent.set(this.current);
        }
    }
    async saveConfiguration(id) {
        this.current.info.id = id;
        let resp = await this.http.saveConfiguration(this.current)
        .then(x => {
        var newBlob = new Blob([x.data], { type: "application/octet-stream" });
            console.log('new blob:', newBlob);

            const data = window.URL.createObjectURL(newBlob);
            var link = document.createElement('a');
            link.href = data;
            link.download = x.fname;
            link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

            setTimeout(function () {
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
            }).catch((err) =>{
                console.log(err);
            });
    }

}
