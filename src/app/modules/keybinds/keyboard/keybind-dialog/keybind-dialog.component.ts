import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'keybind-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './keybind-dialog.component.html'
})
export class KeybindDialogComponent {
    label: string;
    keybinds: { key: string, spell?: string }[];

    constructor(@Inject(MAT_DIALOG_DATA) public data: KeybindDialogData) {
        console.log('data', data);
        this.label = data.key.label;
        this.keybinds = data.key.keybinds;

        console.log('label', this.label);
        console.log('keybinds', this.keybinds);
    }
}

interface KeybindDialogData {
    key: {
        label: string;
        keybinds: { key: string, spell?: string }[];
    }
}
