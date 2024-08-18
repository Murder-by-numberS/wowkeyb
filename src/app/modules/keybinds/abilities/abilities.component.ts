import { Component, ViewEncapsulation, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

//Services
import { KeybindingService } from 'app/core/services/keybinding.service';

//Components
import { ConfirmDialogComponent } from '../../../core/components/confirm-dialog.component';

//Data
import { classes } from 'app/core/data/classes';

//Interfaces
import { Keybinding } from 'app/core/types/keybinding';

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
        MatDialogModule
    ],
})
export class AbilitiesComponent implements OnInit {

    isDisabled = true;

    @Input()
    keybindingSelected: boolean;

    @Input()
    selectedKeybinding: Keybinding;
    selectedKeybindingClass: string;

    classes = classes;
    @Output() selectionClassChanged = new EventEmitter<string>();
    /**
     * Constructor
     */
    constructor(private keybindingService: KeybindingService,
        private dialog: MatDialog
    ) {
        this.keybindingSelected = false;
    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['selectedKeybinding']) {
            console.log('inputProp changed:', changes['selectedKeybinding'].currentValue);
            if (this.selectedKeybinding)
                this.selectedKeybindingClass = this.selectedKeybinding.class;
        }
    }

    onClassChange(event: any) {

        const selectedOption = event.value;
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
            } else {
                console.log('Selection cancelled', this.selectedKeybinding.class);
                this.selectedKeybindingClass = this.selectedKeybinding.class;
            }
        });
    }
}
