import { Component, ViewEncapsulation, Inject, HostListener } from '@angular/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'ability-dialog',
    templateUrl: './ability-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatDialogContent,
        MatDialogActions
    ],
})
export class AbilityDialogComponent {
    isOpen = false;

    // Store the new keybinding value
    newKeybinding: string = this.data.keybinding;


    constructor(
        public dialogRef: MatDialogRef<AbilityDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    close(): void {
        this.dialogRef.close();
    }

    confirm(): void {
        // When the user confirms, return the new keybinding along with the other data
        this.dialogRef.close({ ...this.data, keybinding: this.newKeybinding });
    }

    // Listen for the keydown event globally
    @HostListener('document:keydown', ['$event'])
    captureKeyPress(event: KeyboardEvent): void {
        console.log('event', event);
        // Prevent default behavior to avoid character input (like typing the @ symbol)
        event.preventDefault();

        const modifierKeys = [];

        // Check for modifier keys and add them to the array
        if (event.ctrlKey) modifierKeys.push('ctrl');
        if (event.altKey) modifierKeys.push('alt');
        if (event.shiftKey) modifierKeys.push('shift');

        // Get the actual key pressed (e.g., 1, 2, A, etc.)
        let key = event.key;
        console.log('key', key);
        // Handle special cases for shift + number keys, converting symbols to numbers
        if (event.shiftKey) {

            console.log('shift was pressed');
            console.log('key', key);

            switch (key) {
                case '1': key = '1'; break;  // shift + 1 => 1 (no change)
                case '2': key = '2'; break;  // shift + 2 => 2 (no change)
                case '3': key = '3'; break;  // shift + 3 => 3 (no change)
                case '4': key = '4'; break;  // shift + 4 => 4 (no change)
                case '5': key = '5'; break;  // shift + 5 => 5 (no change)
                case '6': key = '6'; break;  // shift + 6 => 6 (no change)
                case '7': key = '7'; break;  // shift + 7 => 7 (no change)
                case '8': key = '8'; break;  // shift + 8 => 8 (no change)
                case '9': key = '9'; break;  // shift + 9 => 9 (no change)
                case '0': key = '0'; break;  // shift + 0 => 0 (no change)

                // Map shifted symbols to numbers
                case '!': key = '1'; break;  // shift + 1 => 1
                case '@': key = '2'; break;  // shift + 2 => 2
                case '#': key = '3'; break;  // shift + 3 => 3
                case '$': key = '4'; break;  // shift + 4 => 4
                case '%': key = '5'; break;  // shift + 5 => 5
                case '^': key = '6'; break;  // shift + 6 => 6
                case '&': key = '7'; break;  // shift + 7 => 7
                case '*': key = '8'; break;  // shift + 8 => 8
                case '(': key = '9'; break;  // shift + 9 => 9
                case ')': key = '0'; break;  // shift + 0 => 0
                default: break;
            }
        }

        // Ensure that we don't capture modifier keys like 'Shift', 'Control', or 'Alt'
        if (key !== 'Control' && key !== 'Alt' && key !== 'Shift') {
            // Join the modifier keys with the pressed key
            this.newKeybinding = [...modifierKeys, key].join(' + ');
        }

        // Log the key press for debugging
        console.log(`Key pressed: ${key}`);
        console.log(`Keybinding: ${this.newKeybinding}`);
    }




}
