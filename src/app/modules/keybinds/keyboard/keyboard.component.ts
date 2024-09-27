import { Component, ViewEncapsulation, OnInit, viewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgxPanZoomModule, PanZoomComponent, PanZoomModel } from 'ngx-panzoom';

import { DragDropModule, CdkDragDrop, CdkDragEnter, CdkDragExit } from '@angular/cdk/drag-drop';

//Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

//Services
import { DragStateService } from 'app/core/services/drag-state.service';

interface Key {
    label: string;
    width: string;
    isHovered?: boolean;
}


@Component({
    selector: 'keyboard',
    templateUrl: './keyboard.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        RouterLink,
        CommonModule,
        DragDropModule,

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

    keyboardLayout: Key[][] = [
        // Define rows and keys with their respective widths
        [
            { label: 'Esc', width: 'w-12', isHovered: false },
            { label: 'F1', width: 'w-12', isHovered: false }, { label: 'F2', width: 'w-12', isHovered: false },
            { label: 'F3', width: 'w-12', isHovered: false }, { label: 'F4', width: 'w-12', isHovered: false },
            { label: 'F5', width: 'w-12', isHovered: false }, { label: 'F6', width: 'w-12', isHovered: false },
            { label: 'F7', width: 'w-12', isHovered: false }, { label: 'F8', width: 'w-12', isHovered: false },
            { label: 'F9', width: 'w-12', isHovered: false }, { label: 'F10', width: 'w-12', isHovered: false },
            { label: 'F11', width: 'w-12', isHovered: false }, { label: 'F12', width: 'w-12', isHovered: false }
        ],
        [
            { label: '~', width: 'w-12', isHovered: false }, { label: '1', width: 'w-12', isHovered: false },
            { label: '2', width: 'w-12', isHovered: false }, { label: '3', width: 'w-12', isHovered: false },
            { label: '4', width: 'w-12', isHovered: false }, { label: '5', width: 'w-12', isHovered: false },
            { label: '6', width: 'w-12', isHovered: false }, { label: '7', width: 'w-12', isHovered: false },
            { label: '8', width: 'w-12', isHovered: false }, { label: '9', width: 'w-12', isHovered: false },
            { label: '0', width: 'w-12', isHovered: false }, { label: '-', width: 'w-12', isHovered: false },
            { label: '=', width: 'w-12', isHovered: false }, { label: 'Backspace', width: 'w-24', isHovered: false }
        ],
        [
            { label: 'Tab', width: 'w-16', isHovered: false }, { label: 'Q', width: 'w-12', isHovered: false },
            { label: 'W', width: 'w-12', isHovered: false }, { label: 'E', width: 'w-12', isHovered: false },
            { label: 'R', width: 'w-12', isHovered: false }, { label: 'T', width: 'w-12', isHovered: false },
            { label: 'Y', width: 'w-12', isHovered: false }, { label: 'U', width: 'w-12', isHovered: false },
            { label: 'I', width: 'w-12', isHovered: false }, { label: 'O', width: 'w-12', isHovered: false },
            { label: 'P', width: 'w-12', isHovered: false }, { label: '[', width: 'w-12', isHovered: false },
            { label: ']', width: 'w-12', isHovered: false }, { label: '\\', width: 'w-16', isHovered: false }
        ],
        [
            { label: 'Caps Lock', width: 'w-20', isHovered: false }, { label: 'A', width: 'w-12', isHovered: false },
            { label: 'S', width: 'w-12', isHovered: false }, { label: 'D', width: 'w-12', isHovered: false },
            { label: 'F', width: 'w-12', isHovered: false }, { label: 'G', width: 'w-12', isHovered: false },
            { label: 'H', width: 'w-12', isHovered: false }, { label: 'J', width: 'w-12', isHovered: false },
            { label: 'K', width: 'w-12', isHovered: false }, { label: 'L', width: 'w-12', isHovered: false },
            { label: ';', width: 'w-12', isHovered: false }, { label: '\'', width: 'w-12', isHovered: false },
            { label: 'Enter', width: 'w-24', isHovered: false }
        ],
        [
            { label: 'Shift', width: 'w-24', isHovered: false }, { label: 'Z', width: 'w-12', isHovered: false },
            { label: 'X', width: 'w-12', isHovered: false }, { label: 'C', width: 'w-12', isHovered: false },
            { label: 'V', width: 'w-12', isHovered: false }, { label: 'B', width: 'w-12', isHovered: false },
            { label: 'N', width: 'w-12', isHovered: false }, { label: 'M', width: 'w-12', isHovered: false },
            { label: ',', width: 'w-12', isHovered: false }, { label: '.', width: 'w-12', isHovered: false },
            { label: '/', width: 'w-12', isHovered: false }, { label: 'Shift', width: 'w-32', isHovered: false }
        ],
        [
            { label: 'Ctrl', width: 'w-16', isHovered: false, }, { label: 'Fn', width: 'w-16', isHovered: false },
            { label: 'Alt', width: 'w-16', isHovered: false }, { label: 'Space', width: 'w-64', isHovered: false },
            { label: 'Alt', width: 'w-16', isHovered: false }, { label: 'Ctrl', width: 'w-16', isHovered: false },
            { label: '◄', width: 'w-16', isHovered: false }, { label: '▲', width: 'w-16', isHovered: false },
            { label: '▼', width: 'w-16', isHovered: false }, { label: '►', width: 'w-16', isHovered: false }
        ]
    ];


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

    // Methods to handle hover state
    expandKey(key: Key): void {
        console.log('expand key', key);
        key.isHovered = true;
    }

    collapseKey(key: Key): void {
        key.isHovered = false;
    }

    onDrop(event: CdkDragDrop<any>): void {
        console.log('DROPPING - event', event)
        const draggedItem = this.draggedItem;
        if (draggedItem) {
            this.items.push(draggedItem); // Add the dragged item to the items array
            this.dragStateService.stopDragging(draggedItem); // Stop dragging after the drop
        }
    }


    onListEnter(event: CdkDragEnter<any>): void {
        console.log('Drag entered:', event);
    }

    onListExit(event: CdkDragExit<any>): void {
        console.log('Drag exited:', event);
    }

}
