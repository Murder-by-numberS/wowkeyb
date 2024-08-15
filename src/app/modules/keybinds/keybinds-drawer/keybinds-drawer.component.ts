import { Component, ViewEncapsulation, OnInit, signal, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';

import { ClickOutsideDirective } from 'app/directives/click-outside/click-outside.directive';

import { keybinds } from './data';
import { classes } from 'app/core/data/classes';
import { random } from 'lodash';

@Component({
    selector: 'keybinds-drawer',
    templateUrl: './keybinds-drawer.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        NgClass,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatSelectModule,
        MatExpansionModule,
        MatAccordion,
        ClickOutsideDirective
    ],
})
export class KeybindsDrawerComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;

    readonly panelOpenState = signal(false);

    keybindings: {}[];
    selectedKeybindId: string | null = null; // To keep track of the selected keybind
    MAX_SIZE = 10;

    classes = new FormControl('');

    classList = classes.map(obj => obj.name);

    /**
     * Constructor
     */
    constructor() {

        this.keybindings = keybinds;
    }

    ngOnInit(): void {


    }

    createKeybinding(): void {
        console.log('creating keybinding');

        if (this.keybindings.length <= this.MAX_SIZE) {
            this.keybindings.push({
                name: 'new keybinding',
                keybind_id: random(10)
            })
        }
    }

    selectKeybind(id: string): void {
        console.log('id selected', id);

        this.selectedKeybindId = id;
    }

    closeAccordion() {
        this.accordion.closeAll();
    }

    isSelected(itemId: string): boolean {
        return this.selectedKeybindId === itemId;
    }
}
