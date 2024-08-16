//Angular
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

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
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,

        KeyboardComponent,
        AbilitiesComponent,
        KeybindsDrawerComponent
    ],
})
export class KeybindsComponent implements OnInit {
    opened: boolean;

    selectedKeybinding: any = null;
    keybindingSelected: boolean;
    selectedClass: any = null;

    refresh: boolean = false;

    /**
     * Constructor
     */
    constructor(private keybindingService: KeybindingService) {
        this.keybindingSelected = false;

    }

    ngOnInit(): void {
        this.opened = true;
    }

    onKeybindingSelected(keybinding: any) {
        console.log('onKeybindingSelected', keybinding)
        this.selectedKeybinding = keybinding; // Handle the emitted keybind from the child component
        this.keybindingSelected = true;
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

}
