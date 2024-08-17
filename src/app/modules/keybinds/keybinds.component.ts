//Angular
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

//Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';

//Components
import { KeyboardComponent } from './keyboard/keyboard.component';
import { AbilitiesComponent } from './abilities/abilities.component';
import { KeybindsDrawerComponent } from './keybinds-drawer/keybinds-drawer.component';

//Services
import { KeybindingService } from 'app/core/services/keybinding.service';
@Component({
    selector: 'keybinds',
    templateUrl: './keybinds.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        RouterLink,

        FormsModule,
        ReactiveFormsModule,

        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,

        KeyboardComponent,
        AbilitiesComponent,
        KeybindsDrawerComponent
    ],
})
export class KeybindsComponent implements OnInit {
    nameForm: FormGroup;

    opened: boolean;

    selectedKeybinding: any = null;
    selectedKeybindingName: string;
    keybindingSelected: boolean;
    selectedClass: any = null;

    refresh: boolean = false;

    editingName: boolean = false;

    /**
     * Constructor
     */
    constructor(private keybindingService: KeybindingService, private _formBuilder: FormBuilder) {
        this.keybindingSelected = false;
    }

    ngOnInit(): void {
        this.opened = true;

        this.nameForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(32)]]
        });

    }

    onKeybindingSelected(keybinding: any) {
        console.log('onKeybindingSelected', keybinding)
        this.selectedKeybinding = keybinding; // Handle the emitted keybind from the child component
        this.selectedKeybindingName = this.selectedKeybinding.name;
        this.keybindingSelected = true;
        this.nameForm.get('name')?.setValue(this.selectedKeybindingName);
    }

    onSelectionClassChanged(value: string) {
        this.selectedClass = value;
        // You can also perform other actions here
    }

    deleteKeybinding() {
        console.log('deleting keybinding', this.selectedKeybinding);
        this.keybindingService.removeKeybinding(this.selectedKeybinding.id);
        this.selectedKeybinding = null;
        this.keybindingSelected = false;
    }

    saveKeybinding() {
        console.log('save keybinding');
    }

    shareKeybinding() {
        console.log('share keybinding');
    }

    updateKeybindings() {
        const newKeybindings = [
            { id: '1', name: 'Default', class: 'Paladin', keybinds: [{ key: 'Ctrl+C', action: 'Copy' }, { key: 'Ctrl+V', action: 'Paste' }] },
            { id: '2', name: 'Editing', class: 'Mage', keybinds: [{ key: 'Ctrl+X', action: 'Cut' }, { key: 'Ctrl+Z', action: 'Undo' }] }
        ];
        this.keybindingService.updateKeybindings(newKeybindings);
    }

    updateKeybindsInKeybinding() {
        const updatedKeybinds = [{ key: 'Ctrl+P', action: 'Print' }];
        this.keybindingService.updateKeybindsInKeybinding('Default', updatedKeybinds);
    }

    // onNameChange(newValue: string) {
    //     console.log('Updated Value:', newValue);
    //     this.keybindingService.updateKeybindingName(this.selectedKeybinding.id, newValue);
    // }

    editName() {
        this.editingName = true;
    }

    saveName() {

        if (this.nameForm.valid) {
            console.log('Form Submitted', this.nameForm.value);
            this.selectedKeybindingName = this.nameForm.value.name;
            this.keybindingService.updateKeybindingName(this.selectedKeybinding.id, this.nameForm.value.name);
        } else {
            console.log('Form is invalid');
        }

        this.editingName = false;

        console.log('this.selectedKeybindingName', this.selectedKeybindingName)
    }

    cancelName() {
        this.editingName = false;
        console.log('this.nameForm.get(name).value', this.nameForm.get('name').value);
        this.nameForm.reset(); // Resets the form to its initial state
        this.nameForm.get('name')?.setValue(this.selectedKeybindingName);
        console.log('Form reset');
    }

}
