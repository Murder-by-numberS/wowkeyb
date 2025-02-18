//Angular
import { Component, ViewEncapsulation, OnInit, signal, ViewChild, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
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

    @Input() refreshKeybindings: boolean;

    keybindings: Keybinding[];
    filteredKeybindings: Keybinding[];
    selectedKeybindingId: string | null = null; // To keep track of the selected keybind
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

        this.loadKeybindings();
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

    // ngOnChanges(changes: SimpleChanges) {
    //     if (changes['refreshKeybindings'] && changes['refreshKeybindings'].currentValue) {
    //         this.loadKeybindings();
    //     }
    // }

    loadKeybindings() {
        this.keybindingService.currentKeybindings.subscribe(keybindings => this.keybindings = keybindings);
        this.applyFilter();
    }

    selectKeybinding(keybinding: any): void {
        console.log('keybinding selected', keybinding);

        this.selectedKeybindingId = keybinding.keybinding_id;
        console.log('emitting', keybinding)
        this.keybindingSelected.emit(keybinding);
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

    isSelected(keybindingId: string): boolean {
        return this.selectedKeybindingId === keybindingId;
    }

    createKeybinding() {
        this.keybindingService.createKeybinding().subscribe({
            next: (createdKeybinding) => {
                console.log('Keybinding created:', createdKeybinding);
                // Update selected keybinding and emit it
                this.selectedKeybindingId = createdKeybinding.keybinding_id;
                console.log('selectedKeybindingId', this.selectedKeybindingId);
                this.keybindingSelected.emit(createdKeybinding);
                this.loadKeybindings();
            },
            error: (error) => {
                console.error('Error creating keybinding:', error);
                // Handle error appropriately (e.g., show error message to user)
            }
        });
    }

    applyFilter() {
        if (this.filterApplied) {

            console.log('applying filter');
            this.filteredKeybindings = this.keybindings.filter(keybinding => this.selectedClasses.value.includes(keybinding.class));
            console.log('this.filteredKeybindings', this.filteredKeybindings);
            if (!this.filteredKeybindings.some(keybinding => keybinding.keybinding_id === this.selectedKeybindingId)) {
                console.log('applying filter - selectedKeybindingId', this.selectedKeybindingId);
                this.selectedKeybindingId = null;
                this.keybindingSelected.emit(null);
            }
        } else {
            this.filteredKeybindings = this.keybindings;
        }
    }

}
