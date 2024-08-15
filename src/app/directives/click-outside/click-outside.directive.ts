import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appClickOutside]',
    standalone: true
})
export class ClickOutsideDirective {

    @Output() clickOutside = new EventEmitter<void>();

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event.target'])
    public onClick(target: any) {

        const clickedInside = this.elementRef.nativeElement.contains(target);

        // Check if the click is inside a mat-select or mat-option element
        const isMatSelect = target.closest('mat-select') !== null ||
            target.classList.contains('mat-select-trigger');
        const isMatOption = target.closest('mat-option') !== null;

        if (!clickedInside && !isMatSelect && !isMatOption) {
            this.clickOutside.emit();
        }

    }
}
