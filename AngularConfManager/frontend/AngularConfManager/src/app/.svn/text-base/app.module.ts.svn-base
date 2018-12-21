import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatDialogModule } from '@angular/material';
import { MatDialog } from '@angular/material';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import {
         ModalComponent,
         AddModalContent,
         LoginModalContent,
         DeleteModalContent
        } from './modal/modal.component';
import { TableComponent } from './table/table.component';

import { CommunicationService } from './communication.service';
import { DataService } from './data.service';
import { ModalService } from './modal.service';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ROUTES } from '@angular/router';
import { Route } from '@angular/router';


@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        TableComponent,
        ModalComponent,
        AddModalContent,
        LoginModalContent,
        DeleteModalContent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        MatDialogModule,
        NgbModule.forRoot(),
        RouterModule.forRoot([{
          path: '**',
          component: AppComponent
        }])
    ],
    providers: [
        CommunicationService,
        DataService,
        ModalService,
        NgbModal
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        AddModalContent,
        LoginModalContent,
        DeleteModalContent
    ]
})
export class AppModule { }
