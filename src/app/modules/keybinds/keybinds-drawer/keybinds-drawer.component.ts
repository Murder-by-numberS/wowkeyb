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

        const savedKeybindings = localStorage.getItem('keybindings');
        if (savedKeybindings) {
            try {
                const parsedKeybindings = JSON.parse(savedKeybindings);
                this.keybindings = parsedKeybindings;
                // Update the KeybindingService with the saved keybindings
                this.keybindingService.updateKeybindings(parsedKeybindings);
                this.applyFilter();

                // Set the first keybinding as selected and emit it
                if (parsedKeybindings.length > 0) {
                    this.selectedKeybindingId = parsedKeybindings[0].keybinding_id;
                    this.keybindingSelected.emit(parsedKeybindings[0]);
                }
            } catch (error) {
                console.error('Failed to parse keybindings from localStorage:', error);
            }
        }
    }

    loadKeybindings() {
        console.log('KeybindsDrawerComponent - loadKeybindings');
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

            // Use getValue() to get the current value from the BehaviorSubject
            if (!this.keybindingService.currentKeybindingsValue.some(keybinding =>
                keybinding.keybinding_id === this.selectedKeybindingId)) {
                console.log('applying filter - selectedKeybindingId', this.selectedKeybindingId);
                if (this.filteredKeybindings.length > 0) {
                    this.selectedKeybindingId = this.filteredKeybindings[0].keybinding_id;
                    this.keybindingSelected.emit(this.filteredKeybindings[0]);
                }
            }
        }

    }
}
