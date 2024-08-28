import { Component, ViewEncapsulation, OnInit, viewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgxPanZoomModule, PanZoomComponent, PanZoomModel } from 'ngx-panzoom';

import { CdkDragDrop } from '@angular/cdk/drag-drop';

//Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

//Services
import { DragStateService } from 'app/core/services/drag-state.service';

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

    dragging: boolean = false;
    canZoom: boolean = true;

    draggedItem: any;

    //placeholder
    items: any[] = []; // Array to hold the dropped items

    /**
     * Constructor
     */
    constructor(private dragStateService: DragStateService) { }

    ngOnInit(): void {


        this.dragStateService.isDragging$.subscribe((dragging) => {
            console.log('dragging', dragging);
            this.dragging = dragging;
            if (dragging) {
                console.log('toggling off zoom')
                this.canZoom = false;
            } else {
                console.log('toggling on zoom')
                this.canZoom = true;
            }
        });

        // Subscribe to the dragged item observable
        this.dragStateService.draggedItem$.subscribe((item) => {
            this.draggedItem = item;
        });

    }


    scalePerZoomLevel() {
        return 2.0;
    }

    neutralZoomLevel() {
        return 2;
    }

    resetZoom(): void {
        this.panZoom().resetView();
    }

    onZoomInClicked(): void {
        this.panZoom().zoomIn('viewCenter');
    }

    onZoomOutClicked(): void {
        this.panZoom().zoomOut('viewCenter');
    }


    onPanLeft100Clicked(): void {
        this.panZoom().panDelta({ x: -100, y: 0 });
    }



    onPanRight100Clicked(): void {
        this.panZoom().panDelta({ x: 100, y: 0 });
    }



    onPanUp100Clicked(): void {
        this.panZoom().panDelta({ x: 0, y: -100 });
    }



    onPanDown100Clicked(): void {
        this.panZoom().panDelta({ x: 0, y: 100 });
    }

    zoomEnabled() {
        return this.canZoom;
    }

    drop(event: CdkDragDrop<any>): void {
        console.log('DROPPING - event', event)
        const draggedItem = this.draggedItem;
        if (draggedItem) {
            this.items.push(draggedItem); // Add the dragged item to the items array
            this.dragStateService.stopDragging(draggedItem); // Stop dragging after the drop
        }
    }

}
