import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseContentType } from '@angular/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { DataService } from './data.service';

import * as config from './json/config.json';

let httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    })
};

@Injectable({ providedIn: 'root' })
export class CommunicationService {
    // service for handling communication with the server
    // these functions are mostly duplicated from Luca's original
    // an important thing to note in TypeScript is that all of these http
    // functions are marked "async" - they must be called from an async function
    // and used with "await"

    private apiURL = config["apiURL"];  // URL to web api
    //private port = config["port"];
    serverData: JSON;
    private instrList: string[] = ['HIRES','KCWI','LRIS','LRISp','MOSFIRE']; //,'','','','','',''];

    constructor(private httpClient: HttpClient, private sharedCurrent:DataService) { }

    // get list of configs for current instrument
    async showList(current): Promise<any> {

        if (current.name !== 'Instrument' /* default */) {

          console.log("retrieving", current.name, current.progname, "from", current);

            let response = await this.httpClient.post(
                this.apiURL+'getConfigurationList&progname='+current.progname
                    +'&instrument='+current.name,
                {}).toPromise();

          // console.log("showList: ", response)

            current.configurations = response;
            this.sharedCurrent.set(current);
            return response; // => current.configurations

                    // current.configurations = response.data;
                    // setInstVars();
        }
        else {
            return;
        }
    }

    // send the file to the backend to be uploaded to the database
    async loadConfiguration(current): Promise<any> {

        let response = await this.httpClient.post(
            this.apiURL+'sendFile'
                +'&instrument='+current.name
                +'&file='+current.content
                +'&progname='+current.info.progname
                +'&filename='+current.fileName,
            {}).toPromise();

        return (response["statusText"]==="OK");
    }

    async saveAll(current): Promise<any>{

        let response = await this.httpClient.post(
            this.apiURL+'saveAllConfigurations'
                +'&instrument='+current.name
                +'&progname='+current.info.progname,
            {}).toPromise();

        return (response["statusText"]==="OK");
    }

    // save a new configuration
    async addConfiguration(current): Promise<any>{
        console.log("adding", current);

        current.info.progname = current.progname;
        current.info.semester = current.semester;
        current.info.instrument = current.name;

        var data = '';
        for (let item in current.info){
            //console.log(item, ': ', current.info[item]);
            data = data + "&" + item + "=" + current.info[item];
        }
        //console.log(data);


        let response = await this.httpClient.post(
            this.apiURL+'addConfiguration'
                +data,
                {}).toPromise();

        if (response) {
          // console.log("added", response)
            let list_response = await this.showList(current);
            return list_response;
        }
        else {
            return;
        }
    }

    // get an entry to edit
    async editConfiguration(current): Promise<any> {

        let response = await this.httpClient.post(
            this.apiURL+'getConfiguration'
                +'&instrument='+current.name
                +'&id='+current.info.id,
            {}).toPromise();

        if (response) {
            let list_response = await this.showList(current);
            return list_response;
        }
        else {
            return;
        }
    }

    // post a duplicate config (from table buttons)
    async duplicateConfiguration(current): Promise<any> {

        let get_response = await this.httpClient.post(
            this.apiURL+'getConfiguration'
                +'&instrument='+current.name
                +'&id='+current.info.id,
            {}).toPromise();

        current.info = get_response;
        current.info.prognam = current.progname;
        
        var data = '';
        for (let item in current.info){
            //console.log(item, current.info[item]);
            data = data + "&" + item + "=" + current.info[item];
        }

        let commit_response = await this.httpClient.post(
            this.apiURL+'addConfiguration'
                +'&instrument='+current.name
                +'&'+data
                +'&semester='+current.semester,
            {}).toPromise();

        if (commit_response) {
            let list_response = await this.showList(current);
            return list_response;
        }
        else {
            return;
        }
    }

    // delete a config. TODO: only mark as deleted?
    async deleteConfiguration(current): Promise<any>{

        let response = await this.httpClient.post(
            this.apiURL+'deleteConfiguration'
                +'&instrument='+current.name
                +'&id='+current.deleteConfigurationId,
            {}).toPromise();

        if (response) {
            let list_response = await this.showList(current);
            return list_response;
        }
        else {
            return;
        }
    }

    // save a .STATE file to the local directory
    async saveConfiguration(current): Promise<any>{

        //let response = await this.httpClient.post(
        //    this.apiURL+'saveConfiguration'
        //            +'&instrument='+current.name
        //            +'&id='+current.info.id,
        //    {}).toPromise();
        //return (response["statusText"]==="OK");

        //return this.httpClient.post(
        //    this.apiURL+'saveConfiguration'
        //            +'&instrument='+current.name
        //            +'&id='+current.info.id, {
        //        responseType: ResponseContentType.Blob
        //    }).pipe(map(res => {
        //         return {
        //             filename: res.filename,
        //             data: res.blob()
        //         };
        //     }))
        //     .subscribe(res => {
        //         console.log('start download:', res);
        //         var url = window.URL.createObjectURL(res.data);
        //         var a = document.createElement('a');
        //         document.body.appendChild(a);
        //         a.setAttribute('style', 'display: none');
        //         a.href = url;
        //         a.download = 'test.state';
        //         a.click();
        //         window.URL.revokeObjectURL(url);
        //         a.remove();
        //     }, error => {
        //         console.log('download error:', JSON.stringify(error));
        //     }, () => {
        //         console.log('Completed File Download.')
        // });

        let response = await this.httpClient.post(
            this.apiURL+'saveConfiguration'
                    +'&instrument='+current.name
                    +'&id='+current.info.id, {}).toPromise();
        console.log('response: ', response);
        return response;

        /* console.log('start download:', response);
        var url = window.URL.createObjectURL(response);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = response['filename'];
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); */

    }

    // post edited config to database
    async updateConfiguration(current): Promise<any>{

        current.info.semester = current.semester;
        current.info.progname = current.progname;
        current.info.instrument = current.name;

      // console.log("updating", JSON.parse(JSON.stringify({
      //       instrument:current.name,
      //       info:current.info,
      //       id:current.info.id,
      //       semester:current.semester
      //   })));
        
        var data = '';
        for (let item in current.info){
            //console.log(item, current.info[item]);
            data = data + "&" + item + "=" + current.info[item];
        }

        let response = await this.httpClient.post(
            this.apiURL+'updateConfiguration'
                +data,
            {}).toPromise();


        if (response) {
            let list_response = await this.showList(current);
            return list_response;
        }
        else {
            return;
        }
    }

    async getKeckID(): Promise<any> {
        // create a promise for a return value of the keckID
        var response = await this.httpClient.post<any>(
            "session.php",{}).toPromise();

        // Convert the promise to a number
        let keckID: number = response;
        if (keckID===0) document.location.href = "../../login.php?referrer=ObservingTools/ConfigManager";
        return keckID;
    }

    // use keckID cookie to get schedule JSON from backend
    async generateAllowedProgramList(keckID): Promise<any>{

        console.log(keckID)
        let response = await this.httpClient.post<any[]>(
            this.apiURL+"getAllowedPrograms"
                +"&keck_id="+keckID.toString(),
            {}
            ).toPromise();

        // console.log(response);
        // return response;
        if (Object.keys(response).length === 0) {
            return {
                "allowedPrograms":[],
                "allowedInstruments":[]
            };
        }
        else {
            let programs:string[] = response;
            return {
                "allowedPrograms":programs,
                "allowedInstruments":this.instrList
            }
        }
    }

    /**
    ** Return a list of instruments for the given program.
    async getInstrumentList(current): Promise<any>{
        console.log("current: ",current);
        let response = await this.httpClient.post<any[]>(
            this.apiURL+"getInstrumentList"
                +"&keck_id="+current.keckID.toString()
                +"&progname="+current.progname
                +"&semester="+current.semester,
            {}
            ).toPromise();
       
	var allowedInstr = {}; 
        if (Object.keys(response).length === 0) {
            let allowedInstr = { "allowedInstruments": [] };
        }
        else {
            let allowedInstr = { "allowedInstruments": response };
            console.log(allowedInstr);
        }
        return allowedInstr;
    }
    */

    /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    // private handleError<T> (operation = 'operation', result?: T) {
    //   return (error: any): Observable<T> => {
    //
    //     // TODO: send the error to remote logging infrastructure
    //     console.error(error); // log to console instead
    //
    //     // TODO: better job of transforming error for user consumption
    //     this.log(`${operation} failed: ${error.message}`);
    //
    //     // Let the app keep running by returning an empty result.
    //     return of(result as T);
    //   };
    // }

}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
