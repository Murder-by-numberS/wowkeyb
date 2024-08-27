import { Component, ViewEncapsulation, OnInit, viewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgxPanZoomModule } from 'ngx-panzoom';
import { PanZoomComponent, PanZoomModel } from 'ngx-panzoom';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
    selector: 'keyboard',
    templateUrl: './keyboard.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        RouterLink,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        NgxPanZoomModule
    ],
})
export class KeyboardComponent implements OnInit {

    readonly panZoom = viewChild(PanZoomComponent);
    readonly panzoomModel = signal<PanZoomModel>(undefined!);

    /**
     * Constructor
     */
    constructor() { }

    ngOnInit(): void {
    }


    scalePerZoomLevel(): void {

    }

    neutralZoomLevel(): void {

    }
}
