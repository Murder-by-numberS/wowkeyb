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

    getKeybindingById(id: string): Keybinding | undefined {
        const currentKeybindings = this.keybindingsSource.getValue();
        return currentKeybindings.find(kb => kb.id === id);
    }

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
        // console.log('updateKeybindsInKeybinding - name', name)
        // console.log('updateKeybindsInKeybinding - keybinds', keybinds);
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

    updateKeybindingName(id: string, name: string) {
        const currentKeybindings = this.keybindingsSource.getValue();
        const updatedKeybindings = currentKeybindings.map(kb =>
            kb.id === id ? { ...kb, name } : kb
        );

        this.keybindingsSource.next(updatedKeybindings);
    }
}
