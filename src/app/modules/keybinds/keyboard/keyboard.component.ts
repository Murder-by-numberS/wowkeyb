import { Component, ViewEncapsulation, OnInit, viewChild, Input, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { NgxPanZoomModule, PanZoomComponent, PanZoomModel } from 'ngx-panzoom';

//Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

import { Keybinding } from 'app/core/types/keybinding';
import { KeybindDialogComponent } from './keybind-dialog/keybind-dialog.component';

interface Key {
    label: string;
    width: string;
    isHovered?: boolean;
    keybinds?: { key: string, spell?: string }[]
}

@Component({
    selector: 'keyboard',
    templateUrl: './keyboard.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatDialogModule,

        NgxPanZoomModule
    ],
})
export class KeyboardComponent implements OnInit {

    @Input()
    selectedKeybinding: Keybinding;

    readonly panZoom = viewChild(PanZoomComponent);
    readonly panzoomModel = signal<PanZoomModel>(undefined!);

    canZoom: boolean = true;

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
    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {

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

    private calculateDialogWidth(keybindsCount: number): string {
        // Base width for 1-2 keybinds
        const baseWidth = 300;
        // Add 50px for each additional keybind beyond 2
        const extraWidth = Math.max(0, keybindsCount - 2) * 50;
        // Cap the maximum width at 600px
        return `${Math.min(baseWidth + extraWidth, 600)}px`;
    }

    collapseKey(key: Key): void {
        key.isHovered = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedKeybinding']) {
            console.log('Keyboard - inputProp changed:', changes['selectedKeybinding'].currentValue);
            this.updateKeyboardBindings();
        }
    }

    private updateKeyboardBindings(): void {
        // First, clear all existing keybindings and hover states
        this.keyboardLayout.forEach(row => {
            row.forEach(keyItem => {
                keyItem.keybinds = [];
                keyItem.isHovered = false;
            });
        });

        // Only add new keybindings if we have a selected keybinding
        if (this.selectedKeybinding?.keybinds) {
            this.selectedKeybinding.keybinds.forEach(keybind => {
                this.addKeybinding(keybind);
            });
        }
    }

    addKeybinding(keybind) {
        const { key, spell } = keybind;

        const keyParts = key.toLowerCase().split('+');

        const mainKey = keyParts[keyParts.length - 1].toUpperCase(); // Convert to uppercase for matching

        // Find and update the matching key
        this.keyboardLayout.forEach(row => {
            row.forEach(keyItem => {
                if (keyItem.label.toUpperCase() === mainKey) {
                    if (!keyItem.keybinds) {
                        keyItem.keybinds = [];
                    }
                    keyItem.keybinds.push({ key, spell });
                }
            });
        });
    }

    openKeybindDialog(key: any): void {
        console.log('opening key', key);
        if (key.keybinds.length > 0) {
            const dialogWidth = this.calculateDialogWidth(key.keybinds.length);
            this.dialog.open(KeybindDialogComponent, {
                data: { key: key },
                width: dialogWidth
            });
        }
    }

    /**
     * Public method that can be called by parent components to reset the keyboard
     * Clears all keybindings and hover states
     */
    public resetKeyboard(): void {
        this.keyboardLayout.forEach(row => {
            row.forEach(keyItem => {
                keyItem.keybinds = [];
                keyItem.isHovered = false;
            });
        });
    }
}
