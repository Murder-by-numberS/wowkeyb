import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DragStateService {
    private dragging = new BehaviorSubject<boolean>(false);
    private draggedItem = new BehaviorSubject<any>(null);

    isDragging$ = this.dragging.asObservable();
    draggedItem$ = this.draggedItem.asObservable();

    startDragging(item: any): void {
        this.dragging.next(true);
        this.draggedItem.next(item);
    }

    stopDragging(item: any): void {
        console.log('DragStateService - stopDragging', item)
        this.dragging.next(false);
        this.draggedItem.next(null);
    }
}
