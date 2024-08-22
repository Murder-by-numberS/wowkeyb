import { Component, ViewEncapsulation, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
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
        RouterLink,
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
                this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                this.specs = Object.keys(fullClasses[this.selectedKeybindingClass].specs);
                this.heroTalents = fullClasses[this.selectedKeybindingClass].specs[this.selectedKeybindingSpec]
                if (this.selectedKeybindingSpec && this.selectedKeybindingHeroTalent) {
                    this.fetchAbilities();
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
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { class: selectedOption });
                    this.selectedKeybindingClass = selectedOption;
                    this.selectedKeybinding.class = this.selectedKeybindingClass;
                    this.selectedKeybinding.spec = undefined;
                    this.selectedKeybinding.heroTalent = undefined;
                    this.selectedKeybindingSpec = undefined;
                    this.selectedKeybindingHeroTalent = undefined;
                    console.log('this.selectedKeybindingSpec', this.selectedKeybindingSpec);
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { class: selectedOption, heroTalent: null, spec: null });
                    this.specs = Object.keys(fullClasses[this.selectedKeybindingClass].specs);
                    console.log('this.specs', this.specs);
                    this.selectionClassChanged.emit(null);
                    this.abilities = [];
                } else {
                    console.log('Selection cancelled', this.selectedKeybinding.class);
                    this.selectedKeybindingClass = this.selectedKeybinding.class;
                    this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                }
            });

        } else {
            this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { class: selectedOption });
            this.selectedKeybindingClass = selectedOption;
            this.selectedKeybinding.class = this.selectedKeybindingClass;
            this.selectedKeybinding.spec = undefined;
            this.selectedKeybinding.heroTalent = undefined;
            this.selectedKeybindingSpec = undefined;
            this.selectedKeybindingHeroTalent = undefined;
            console.log('this.selectedKeybindingSpec', this.selectedKeybindingSpec);
            this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { class: selectedOption, heroTalent: null, spec: null });
            this.specs = Object.keys(fullClasses[this.selectedKeybindingClass].specs);
            console.log('this.specs', this.specs);
            this.selectionClassChanged.emit(null);
            this.abilities = [];
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
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { spec: selectedOption });
                    this.selectedKeybindingSpec = selectedOption;
                    this.selectedKeybinding.spec = this.selectedKeybindingSpec;
                    this.selectedKeybindingHeroTalent = undefined;
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { heroTalent: selectedOption });
                    this.heroTalents = fullClasses[this.selectedKeybindingClass].specs[this.selectedKeybindingSpec]
                    console.log('this.heroTalents', this.heroTalents);
                    this.abilities = [];
                } else {
                    console.log('Selection cancelled', this.selectedKeybinding.class);
                    this.selectedKeybindingClass = this.selectedKeybinding.class;
                    this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                }
            });
        } else {
            this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { spec: selectedOption });
            this.selectedKeybindingSpec = selectedOption;
            this.selectedKeybinding.spec = this.selectedKeybindingSpec;

            this.heroTalents = fullClasses[this.selectedKeybindingClass].specs[this.selectedKeybindingSpec]
            console.log('this.heroTalents', this.heroTalents);
        }
    }

    onHeroTalentChange(event: any) {

        const selectedOption = event.value;

        if (this.selectedKeybinding.heroTalent) {

            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: { text: 'Are you sure you want to select', option: selectedOption }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    console.log('Selection confirmed:', selectedOption);
                    console.log('hero talent changed');
                    this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { heroTalent: selectedOption });
                    this.selectedKeybindingHeroTalent = selectedOption;
                    this.selectedKeybinding.heroTalent = this.selectedKeybindingHeroTalent;
                    // // this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    // // this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                    // // this.fetchAbilities();
                    // this.specs = fullClasses[this.selectedKeybindingClass]
                    // console.log('this.specs');
                    this.fetchAbilities();
                } else {
                    console.log('Selection cancelled', this.selectedKeybinding.class);
                    this.selectedKeybindingClass = this.selectedKeybinding.class;
                    this.selectedKeybindingSpec = this.selectedKeybinding.spec;
                    this.selectedKeybindingHeroTalent = this.selectedKeybinding.heroTalent;
                    this.fetchAbilities();
                }
            });

        } else {
            this.keybindingService.updateKeybinding(this.selectedKeybinding.id, { heroTalent: selectedOption });
            this.selectedKeybindingHeroTalent = selectedOption;
            this.selectedKeybinding.heroTalent = this.selectedKeybindingHeroTalent;
            this.fetchAbilities();
        }

    }

    fetchAbilities() {
        console.log('fetching abilities for class', this.selectedKeybindingClass);

        // this.abilities = this.abilitiesService.getAbilities(this.selectedKeybindingClass)
        this.abilitiesService.getAbilities(this.selectedKeybindingClass, this.selectedKeybindingSpec, this.selectedKeybindingHeroTalent)
            .subscribe((data) => { this.abilities = data; },
                (err) => {
                    console.log('getAbilities - err', err);
                });
    }
}
