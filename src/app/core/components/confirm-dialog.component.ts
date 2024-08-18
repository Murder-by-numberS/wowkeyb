import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [
        MatDialogActions, MatDialogContent, MatButtonModule,
    ],
    template: `
    <h2 mat-dialog-title>Confirm Selection</h2>
    <mat-dialog-content>
      <div class="flex flex-row"><p>{{data.text}}<p>
        @if(data.option){<p class="ml-2">{{ data.option }}?<p>}</div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-stroked-button (click)="onCancel()">Cancel</button>
      <button mat-stroked-button color="primary" (click)="onConfirm()">Confirm</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }
}
