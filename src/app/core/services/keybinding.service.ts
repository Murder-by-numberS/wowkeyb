import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Keybinding } from '../types/keybinding';
import { Keybind } from '../types/keybind';

interface KeybindUpdate {
    addedKeybinds: Keybind[];
    removedKeybinds: Keybind[];
}

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

    hasKeybindKey(keybindingId: string, key: string): boolean {
        const keybinding = this.getKeybindingById(keybindingId);
        if (!keybinding) return false;

        return keybinding.keybinds.some(keybind => keybind.key === key);
    }

    updateKeybindsInKeybinding(name: string, update: KeybindUpdate) {
        const currentKeybindings = this.keybindingsSource.getValue();
        const { addedKeybinds, removedKeybinds } = update;
        console.log('addedKeybinds', addedKeybinds);
        const updatedKeybindings = currentKeybindings.map(kb => {
            console.log('kb', kb)
            if (kb.name === name) {
                console.log('found keybinding');
                let keybinds = [...kb.keybinds];
                console.log('before keybinds', keybinds);
                // Remove keybinds
                if (removedKeybinds?.length) {
                    console.log('removing keybinds', removedKeybinds);
                    keybinds = keybinds.filter(existing =>
                        !removedKeybinds.some(remove =>
                            remove.key === existing.key &&
                            JSON.stringify(remove.spell.spellId) === JSON.stringify(existing.spell.spellId)
                        )
                    );
                }
                console.log('keybinds after removedKeybinds', keybinds);
                // Add new keybinds
                if (addedKeybinds?.length) {
                    keybinds.push(...addedKeybinds);
                }
                console.log('after keybinds', keybinds);
                return { ...kb, keybinds };
            }
            console.log('after - kb', kb)
            return kb;
        });
        console.log('returning updatedKeybindings', updatedKeybindings);
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
