import { Component, ViewEncapsulation, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';

//Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

//Services
import { KeybindingService } from 'app/core/services/keybinding.service';
import { AbilitiesService } from 'app/core/services/abilities.service';

//Components
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog.component';
import { AbilityDialogComponent } from './ability-dialog/ability-dialog.component';

//Data
import { classes, fullClasses } from 'app/core/data/classes';

//Interfaces
import { Keybinding } from 'app/core/types/keybinding';
import { Ability } from 'app/core/types/ability';

@Component({
    selector: 'abilities',
    templateUrl: './abilities.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatTooltipModule
    ],
})
export class AbilitiesComponent implements OnInit {

    isDisabled = true;

    @Input()
    keybindingSelected: boolean;

    @Input()
    selectedKeybinding: Keybinding;
    selectedKeybindingClass: string;
    selectedKeybindingSpec: string;
    selectedKeybindingHeroTalent: string;

    abilities: Ability[];

    classes = classes;
    specs = [];
    heroTalents = [];

    @Output() selectionClassChanged = new EventEmitter<string>();
    @Output() keybindingUpdated = new EventEmitter<any>();

    currentPage = 0;
    abilitiesPerPage = 12; // Set the number of abilities per page

    /**
     * Constructor
     */
    constructor(
        private keybindingService: KeybindingService,
        private abilitiesService: AbilitiesService,
        private dialog: MatDialog
    ) {
        this.keybindingSelected = false;
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedKeybinding']) {
            console.log('inputProp changed:', changes['selectedKeybinding'].currentValue);
            if (this.selectedKeybinding) {
                this.selectedKeybindingClass = this.selectedKeybinding.class;
                this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent === 'San Layn'
                    ? 'San\'layn'
                    : this.selectedKeybinding.heroTalent === 'Fel Scarred'
                        ? 'Fel-Scarred'
                        : this.selectedKeybinding.heroTalent === 'Elunes Chosen'
                            ? 'Elune\'s Chosen'
                            : this.selectedKeybinding.heroTalent;
                this.specs = Object.keys(fullClasses[this.selectedKeybindingClass].specs);
                this.heroTalents = fullClasses[this.selectedKeybindingClass].specs[this.selectedKeybindingSpec]
                if (this.selectedKeybindingSpec && this.selectedKeybindingHeroTalent) {
                    this.fetchAbilities();
                } else {
                    this.abilities = [];
                }
            }
        }
    }

    onClassChange(event: any) {

        const selectedOption = event.value;

        if (this.selectedKeybinding.spec) {

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { text: 'Are you sure you want to select', option: selectedOption }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    console.log('Selection confirmed:', selectedOption);
                    console.log('class changed');
                    this.selectedKeybindingClass = selectedOption;
                    this.selectedKeybinding.class = this.selectedKeybindingClass;
                    this.selectedKeybinding.spec = undefined;
                    this.selectedKeybinding.heroTalent = undefined;
                    this.selectedKeybindingSpec = undefined;
                    this.selectedKeybindingHeroTalent = undefined;
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { class: selectedOption, heroTalent: null, spec: null })
                        .subscribe({
                            next: (updatedKeybinding) => {
                                this.selectedKeybinding.keybinds = [];
                                this.keybindingService.updateKeybindsInKeybinding(this.selectedKeybinding.name, { addedKeybinds: [], removedKeybinds: [] });
                                this.specs = Object.keys(fullClasses[this.selectedKeybindingClass].specs);
                                this.selectionClassChanged.emit(null);
                                this.abilities = [];
                            },
                            error: (error) => {
                                console.error('Error updating keybinding:', error);
                            }
                        });
                } else {
                    console.log('Selection cancelled', this.selectedKeybinding.class);
                    this.selectedKeybindingClass = this.selectedKeybinding.class;
                    this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                }
            });

        } else {
            this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { class: selectedOption });
            this.selectedKeybindingClass = selectedOption;
            this.selectedKeybinding.class = this.selectedKeybindingClass;
            this.selectedKeybinding.spec = undefined;
            this.selectedKeybinding.heroTalent = undefined;
            this.selectedKeybindingSpec = undefined;
            this.selectedKeybindingHeroTalent = undefined;
            console.log('this.selectedKeybindingSpec', this.selectedKeybindingSpec);
            this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { class: selectedOption, heroTalent: null, spec: null })
                .subscribe({
                    next: (updatedKeybinding) => {
                        this.selectedKeybinding.keybinds = [];
                        this.keybindingService.updateKeybindsInKeybinding(this.selectedKeybinding.name, { addedKeybinds: [], removedKeybinds: [] });
                        this.specs = Object.keys(fullClasses[this.selectedKeybindingClass].specs);
                        console.log('this.specs', this.specs);
                        this.selectionClassChanged.emit(null);
                        this.abilities = [];
                    },
                    error: (error) => {
                        console.error('Error updating keybinding:', error);
                    }
                });
        }
    }

    onSpecChange(event: any) {

        const selectedOption = event.value;
        console.log('this.selectedKeybinding.spec', this.selectedKeybinding.spec);
        if (this.selectedKeybinding.spec) {

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { text: 'Are you sure you want to select', option: selectedOption }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    console.log('Selection confirmed:', selectedOption);
                    console.log('spec changed');
                    this.selectedKeybindingSpec = selectedOption;
                    this.selectedKeybinding.spec = this.selectedKeybindingSpec;
                    this.selectedKeybindingHeroTalent = undefined;
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { spec: selectedOption, heroTalent: undefined })
                        .subscribe({
                            next: (updatedKeybinding) => {
                                this.heroTalents = fullClasses[this.selectedKeybindingClass].specs[this.selectedKeybindingSpec];
                                console.log('this.heroTalents', this.heroTalents);
                                this.selectedKeybinding.keybinds = [];
                                this.selectedKeybinding.heroTalent = undefined;
                                this.keybindingService.updateKeybindsInKeybinding(this.selectedKeybinding.name, { addedKeybinds: [], removedKeybinds: [] });
                                this.selectionClassChanged.emit(null);
                                this.abilities = [];
                            },
                            error: (error) => {
                                console.error('Error updating keybinding:', error);
                            }
                        });
                } else {
                    console.log('Selection cancelled', this.selectedKeybinding.class);
                    this.selectedKeybindingClass = this.selectedKeybinding.class;
                    this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                }
            });
        } else {
            this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { spec: selectedOption })
                .subscribe({
                    next: (updatedKeybinding) => {
                        this.selectedKeybindingSpec = selectedOption;
                        this.selectedKeybinding.spec = this.selectedKeybindingSpec;

                        this.heroTalents = fullClasses[this.selectedKeybindingClass].specs[this.selectedKeybindingSpec]
                        console.log('this.heroTalents', this.heroTalents);
                    },
                    error: (error) => {
                        console.error('Error updating keybinding:', error);
                    }
                });
        }
    }

    onHeroTalentChange(event: any) {

        const selectedOption = event.value;
        console.log('has heroTalent - this.selectedKeybinding.heroTalent', this.selectedKeybinding.heroTalent);
        if (this.selectedKeybinding.heroTalent) {

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { text: 'Are you sure you want to select', option: selectedOption }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    console.log('Selection confirmed:', selectedOption);
                    console.log('hero talent changed');
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { heroTalent: selectedOption })
                        .subscribe({
                            next: (updatedKeybinding) => {
                                this.selectedKeybindingHeroTalent = selectedOption;
                                this.selectedKeybinding.heroTalent = this.selectedKeybindingHeroTalent;
                                this.fetchAbilities();
                                this.selectedKeybinding.keybinds = [];
                                this.keybindingService.updateKeybindsInKeybinding(this.selectedKeybinding.name, { addedKeybinds: [], removedKeybinds: [] });
                                this.selectionClassChanged.emit(null);
                            },
                            error: (error) => {
                                console.error('Error updating keybinding:', error);
                            }
                        });
                } else {
                    console.log('Selection cancelled', this.selectedKeybinding.class);
                    this.selectedKeybindingClass = this.selectedKeybinding.class;
                    this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                    this.fetchAbilities();
                }
            });

        } else {
            this.keybindingService.updateKeybinding(this.selectedKeybinding.keybinding_id, { heroTalent: selectedOption })
                .subscribe({
                    next: (updatedKeybinding) => {
                        this.selectedKeybindingHeroTalent = selectedOption;
                        this.selectedKeybinding.heroTalent = this.selectedKeybindingHeroTalent;
                        this.fetchAbilities();
                        this.selectedKeybinding.keybinds = [];
                        this.keybindingService.updateKeybindsInKeybinding(this.selectedKeybinding.name, { addedKeybinds: [], removedKeybinds: [] });
                        this.selectionClassChanged.emit(null);
                    },
                    error: (error) => {
                        console.error('Error updating keybinding:', error);
                    }
                });
        }

    }

    fetchAbilities() {
        console.log('fetching abilities for', {
            class: this.selectedKeybindingClass,
            spec: this.selectedKeybindingSpec,
            heroTalent: this.selectedKeybindingHeroTalent
        });

        if (this.selectedKeybindingClass, this.selectedKeybindingSpec, this.selectedKeybindingHeroTalent) {
            const formattedClass = this.selectedKeybindingClass?.replace(/\s+/g, '');
            const formattedSpec = this.selectedKeybindingSpec?.replace(/\s+/g, '-');
            const formattedHeroTalent = this.selectedKeybindingHeroTalent?.toLowerCase().replace(/'/g, '').replace(/\s+/g, '-');

            this.abilitiesService.getAbilities(
                formattedClass,
                formattedSpec,
                formattedHeroTalent
            ).subscribe((data) => {
                this.abilities = data;
            }, (err) => {
                console.log('getAbilities - err', err);
            });
        }
    }

    selectKey(ability: Ability) {
        console.log('selecting key: open a modal', ability);

        const dialogRef = this.dialog.open(AbilityDialogComponent, {
            data: { ability, keybinding: this.selectedKeybinding }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const oldKeybindings = ability.keybindings || [];
                const newKeybindings = result.keybindings;

                // Handle removed keybindings
                const removedKeybinds = oldKeybindings
                    .filter(key => !newKeybindings.includes(key))
                    .map(key => ({ key, spell: ability }));

                // Handle added keybindings
                const addedKeybinds = newKeybindings
                    .filter(key => !oldKeybindings.includes(key))
                    .map(key => ({ key, spell: ability }));

                // Update the ability's keybindings
                console.log('newKeybindings', newKeybindings);
                ability.keybindings = newKeybindings;

                this.keybindingUpdated.emit({
                    addedKeybinds,
                    removedKeybinds
                });
            }
        });
    }

    // Get the abilities for the current page
    getAbilitiesForCurrentPage() {
        const startIndex = this.currentPage * this.abilitiesPerPage;
        const endIndex = startIndex + this.abilitiesPerPage;

        if (this.selectedKeybinding?.keybinds.length > 0) {
            // Loop through each keybinding in the selectedKeybinding.keybinds array
            this.selectedKeybinding.keybinds.forEach(keybind => {
                const spellId = keybind.spell.spellId;
                const ability = this.abilities.find(ability => ability.spellId === spellId);

                if (ability) {
                    // Initialize keybindings array if it doesn't exist
                    if (!ability.keybindings) {
                        ability.keybindings = [];
                    }
                    // Add the key if it's not already in the keybindings array
                    if (!ability.keybindings.includes(keybind.key)) {
                        ability.keybindings.push(keybind.key);
                    }
                }
            });
        }

        return this.abilities.slice(startIndex, endIndex);
    }

    // Go to the previous page
    goToPreviousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
        }
    }

    // Go to the next page
    goToNextPage() {
        if (this.currentPage < this.maxPage()) {
            this.currentPage++;
        }
    }

    // Calculate the maximum page index
    maxPage() {
        return Math.floor(this.abilities.length / this.abilitiesPerPage);
    }

    // Get the start index of the current page
    getStartIndex() {
        return this.currentPage * this.abilitiesPerPage;
    }

    // Get the end index of the current page
    getEndIndex() {
        const endIndex = (this.currentPage + 1) * this.abilitiesPerPage;
        return endIndex > this.abilities.length ? this.abilities.length : endIndex;
    }

}
