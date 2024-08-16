import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Keybinding } from '../types/keybinding';
import { Keybind } from '../types/keybind';

@Injectable({
    providedIn: 'root'
})
export class KeybindingService {
    private keybindingsSource = new BehaviorSubject<Keybinding[]>([]);
    currentKeybindings = this.keybindingsSource.asObservable();

    updateKeybindings(keybindings: Keybinding[]) {
        this.keybindingsSource.next(keybindings);
    }

    addKeybinding(keybinding: Keybinding) {
        const currentKeybindings = this.keybindingsSource.getValue();
        this.keybindingsSource.next([...currentKeybindings, keybinding]);
    }

    removeKeybinding(id: string) {
        const currentKeybindings = this.keybindingsSource.getValue();
        this.keybindingsSource.next(currentKeybindings.filter(kb => kb.id !== id));
    }

    updateKeybindsInKeybinding(name: string, keybinds: Keybind[]) {
        const currentKeybindings = this.keybindingsSource.getValue();
        const updatedKeybindings = currentKeybindings.map(kb =>
            kb.name === name ? { ...kb, keybinds } : kb
        );
        this.keybindingsSource.next(updatedKeybindings);
    }

    updateKeybinding(id: string, updatedKeybinding: Partial<Keybinding>) {
        const currentKeybindings = this.keybindingsSource.getValue();
        const updatedKeybindings = currentKeybindings.map(kb =>
            kb.id === id ? { ...kb, ...updatedKeybinding } : kb
        );
        this.keybindingsSource.next(updatedKeybindings);
    }
}
