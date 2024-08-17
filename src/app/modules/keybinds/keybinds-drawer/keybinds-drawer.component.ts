//Angular
import { Component, ViewEncapsulation, OnInit, signal, ViewChild, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

//Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAccordion } from '@angular/material/expansion';

//Directives
import { ClickOutsideDirective } from 'app/core/directives/click-outside/click-outside.directive';

//Services
import { KeybindingService } from 'app/core/services/keybinding.service';


import { Keybinding } from 'app/core/types/keybinding';
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

    keybindings: Keybinding[];
    filteredKeybindings: Keybinding[];
    selectedKeybindId: string | null = null; // To keep track of the selected keybind
    @Output() keybindingSelected = new EventEmitter<any>();
    MAX_SIZE = 10;

    selectedClasses = new FormControl([]);

    classList = classes.map(obj => obj.name);

    filterApplied: boolean = false;

    /**
     * Constructor
     */
    constructor(private keybindingService: KeybindingService) {

    }

    ngOnInit(): void {

        this.keybindingService.currentKeybindings.subscribe(keybindings => this.keybindings = keybindings);
        this.filteredKeybindings = this.keybindings;
        // //fetch keybindings for user if logged in

        // if (this.keybindings && this.keybindings.length > 0) {
        //     this.selectedKeybindId = this.keybindings[0]['keybind_id'];
        //     this.keybindSelected.emit(this.keybindings[0]);
        // }

    }

    // createKeybinding(): void {
    //     console.log('creating keybinding');

    // if (this.keybindings.length <= this.MAX_SIZE) {

    //     //call API
    //     const newKeybind = {
    //         name: 'new keybinding',
    //         keybind_id: random(10).toString()
    //     }
    //     this.keybindings.push(newKeybind);

    //     this.selectedKeybindId = newKeybind.keybind_id;
    //     this.keybindSelected.emit(newKeybind);
    // }
    // }

    selectKeybinding(keybind: any): void {
        console.log('keybind selected', keybind);

        this.selectedKeybindId = keybind.id;
        console.log('emitting', keybind)
        this.keybindingSelected.emit(keybind);
    }

    closeAccordion() {
        this.accordion.closeAll();

        console.log('apply filter')
        console.log('filter:', this.selectedClasses.value);
        if (this.selectedClasses.value.length > 0) {
            this.filterApplied = true;
            console.log('this.selectedClasses.value', typeof this.selectedClasses.value);
            this.applyFilter();
        }
        else {
            this.filterApplied = false;
            this.filteredKeybindings = this.keybindings;
        }


    }

    isSelected(keybindId: string): boolean {
        return this.selectedKeybindId === keybindId;
    }

    createKeybinding() {
        const newKeybinding = { id: '3', name: 'New Keybinding', class: 'Warrior', keybinds: [{ key: 'Ctrl+N', action: 'New Tab' }] };
        this.keybindingService.addKeybinding(newKeybinding);

        this.selectedKeybindId = newKeybinding.id;
        this.keybindingSelected.emit(newKeybinding);
    }

    applyFilter() {
        this.filteredKeybindings = this.keybindings.filter(keybinding => this.selectedClasses.value.includes(keybinding.class));

        if (!this.filteredKeybindings.some(keybinding => keybinding.id === this.selectedKeybindId)) {
            this.selectedKeybindId = null;
            this.keybindingSelected.emit(null);
        }

    }

}
