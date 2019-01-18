import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '../communication.service';
import { DataService } from '../data.service';
import { ModalService } from '../modal.service';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import * as json_data from '../json/instrumentConfData.json';
import * as config from '../json/config.json';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    data:any;

    allowedPrograms: Array<string>;
    allowedInstruments: Array<string>;
    allowedSemesters: Object;
    private keckID: number = 0;

    subscription:Subscription;

    // default values so the selectors have something to display
    current:any = {"name":"Instrument","progname":"Program","semester":"Semester"};

    opt_show:boolean;
    show_opt:boolean;
    inst_name:string;
    sem_show:boolean;

    // url params (optional)
    url_program:string;
    url_instrument:string;
    url_semester:string;

    // urls to connected ToO config programs
    OOPGUI:string = config["oopgui"];
    TOORT:string = config["toort"];

    constructor(private http:CommunicationService,
                private sharedCurrent:DataService,
                private modal:ModalService,
                private route: ActivatedRoute
                ) { }

    getData() {
        return json_data;
    }

    getCurrentSemester(): string[] {
        let myDate: Date = new Date();
        let strDate: string = formatDate(myDate, 'yyyy-MM-dd', 'en-US', '-1000');
        let sem: string = "A";
        let nextSem: string = '';
        let isNextSemOut: boolean = false;
        var [yr,mo,dy] = strDate.split('-');
        var year: number = Number(yr);
        var month: number = Number(mo);
        var day: number = Number(dy);

        // Check which semester it currently is
        if (month < 2 || (month == 2 && day == 1)){ 
            sem = "B";
            year = year - 1;
        }
        else if (month > 8) sem = "B";
        else if (month == 8 && day > 1) sem = "B";

        // Check if the new schedule has been published
        if ((month > 5 && month < 8) || (month == 12 || month < 2)) isNextSemOut = true;
        if (isNextSemOut && sem == 'B') nextSem = (year+1).toString() + 'A';
        else if (isNextSemOut) nextSem = yr + 'B';

        // Create the current semester
        sem = year.toString() + sem;

        let semester: Array<string> = [sem];
        if (isNextSemOut) semester.push(nextSem);

        // Return the array of current semesters
        return semester;
    }

    async ngOnInit() {

        this.data = this.getData();

        this.keckID = await this.http.getKeckID();
        console.log("current id: ", this.keckID);
        this.current['keckID'] = this.keckID;

        //let permissions = await this.http.generateAllowedProgramList(cookies["keckID"]);
        let programs = await this.http.generateAllowedProgramList(this.keckID);
        //console.log("programs: ", programs);


        if (!programs) {
          // console.log("bad login")
            this.modal.show({
                "name":"login",
                "data":""
            });
        }

        //console.log(programs)
        this.allowedPrograms = programs["allowedPrograms"];
        console.log("allowed progs", typeof(this.allowedPrograms));
        this.allowedInstruments = programs['allowedInstruments'];
        //console.log('allowed: ',this.allowedInstruments)

        // debug mode
        this.allowedSemesters = this.getCurrentSemester();


        // query the URL parameters to open a program/config on load
        await this.route.queryParams
        .subscribe(async params => {
            this.inst_name = "Instrument";
            //console.log("current inst: ", this.inst_name);

            if (params){
                //console.log("params", params);
                if (this.allowedPrograms.includes(params.program)) {
                    this.url_program = params.program;
                    this.current.progname = this.url_program;

                    await this.swapProgram(this.url_program);
                }

                if (params.semester) {
                    this.url_semester = params.semester;
                    this.current.semester = this.url_semester;

                    await this.swapSemester(this.url_semester);
                }

                if (params.instrument) {
                    this.url_instrument = params.instrument;
                    this.current.name = this.url_instrument;
                    this.inst_name = params.instrument;

                    await this.swapInstrument(this.url_instrument);
                }

                if (params.id) {
                    if (params.instrument && this.allowedPrograms.includes(params.program)){
                        await this.modal.show({
                            "name":"add",
                            "data":{
                                "current":this.current,
                                "showAdd":false,
                                "id":params.id
                            }
                        });
                    }
                } else if (params.instrument && this.allowedPrograms.includes(params.program)) {
                    this.inst_name = params.instrument;
                    await this.modal.show({
                        "name":"add",
                        "data":{
                            "current":this.current,
                            "showAdd":true,
                        }
                    });
                }

                // TODO add support for importing a config from format simulator
                // this.current.info = params.config
            }
        });

        this.show_opt,this.opt_show=false;
        //console.log("instrument: ", this.inst_name);

        this.sharedCurrent.set(this.current);
        this.subscription = this.sharedCurrent.currentMessage.subscribe((val) => {
            // console.log("nav got current-val from subscription", val);
            if (val) {
                if (this.current != val){
                    this.current = val;
                    this.showList();
                }
            }
        });

        // console.log(data["HIRES"]);

    }

    setDataToResult(result) {
        this.current.configurations = result;
        this.sharedCurrent.set(this.current);
    }

    getCookieList() {
        let c = document.cookie;
        console.log(c);
        var c_arr = c.split(';');
        console.log(c_arr);
        var keckid = 0;
        for (var i=0; i<c_arr.length; i++){
            console.log(c_arr[i]);
            var els = c_arr[i].split('=');
            console.log(els);
            if (els[0] == 'keckID')
                keckid = parseFloat(els[1]);
        }
        return keckid;
    }

    async showList() {
        if (this.current.name !== "Instrument" && this.current.progname
                !== "Program" && this.current.semester !== "Semester"){
            this.current.data = this.data[this.current.name]["data"];

            console.log("updating current: ", this.current, "\ndata: ", this.data);
            let response = await this.http.showList(this.current);
            this.setDataToResult(response);
        }
    }

    async swapProgram(program:string) {
        // console.log(program)
        this.current["progname"]=program;
        if (program !== "Program") {
            await this.showList();
        }
    }

    async swapInstrument(inst:string) {
        console.log('swapInst: ',inst);
        let prog: string = this.current["progname"];
        let sem: string = this.current["semester"];

        this.current=this.data[inst];


        if (prog !== "Program") {
            this.current["progname"] = prog;
        }
        if (sem !== "Semester") {
            this.current["semester"] = sem;
        }

        if ((prog !== "Program") && (sem !== "Semester")) {
            await this.showList();
        }

    }

    async swapSemester(sem:string) {
        // console.log(sem);
        this.current["semester"] = sem;
        if (sem !== "Semester") {
            await this.showList();
        }

    }

    showAddPopUp() {
        this.current.info = new Object({});
        this.sharedCurrent.set(this.current);

        this.modal.show({
            "name":"add",
            "data":{
                "current":this.current,
                "showAdd":true
            }
        });
    }

    showEditPopup() {
        this.modal.show({
            "name":"add",
            "data":{
                "current":this.current,
                "showAdd":false
            }
        })
    }

    doFileInput(event:any) {
        event.preventDefault();

        let element: HTMLElement = document.getElementById('statefile');
        element.click();
    }

    parseFile(file:File): string {

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt:any) {
            // console.log('returned val')
            return evt.target.result;
        }
        reader.onerror = function (evt) {
            throw evt;
        }

        return "";
    }

    OSIRISredirect() {
        window.location.href = this.OOPGUI;
    }

    onFileContentChange(event:any) {
        let content:string = this.parseFile(event.target.files[0]);

        // console.log(this.current)

        content.split('\n').forEach(function(entry) {
          // console.log(entry)
            let mat = entry.match(/([\w_]+)\s*\=\s*([\w_,.]+)/);
            // console.log(mat);
            this.current.info[mat[1]]=mat[2];
        }, this);

        if (this.current.progname !== this.current.info.progname){
            alert("Warning: state file uploaded for inactive program '" + this.current.info.progname + "'");
            // if (this.current.info.progname.toString() in this.allowedPrograms) {
            //     this.current.progname = this.current.info.progname;
            // }
            // else {
            //     // alert('nope')
            //     console.log(this.current.info.progname, this.allowedPrograms)
            // }
        }
        else {
            this.showEditPopup();
        }
    }

}
