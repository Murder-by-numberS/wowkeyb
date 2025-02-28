import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

import { environment } from 'environments/environment';

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

    get currentKeybindingsValue(): Keybinding[] {
        return this.keybindingsSource.getValue();
    }

    constructor(private http: HttpClient) { }

    getKeybindingById(id: string): Keybinding | undefined {
        const currentKeybindings = this.keybindingsSource.getValue();
        return currentKeybindings.find(kb => kb.keybinding_id === id);
    }

    updateKeybindings(keybindings: Keybinding[]) {
        this.keybindingsSource.next(keybindings);
    }

    addKeybinding(keybinding: Keybinding) {
        const currentKeybindings = this.keybindingsSource.getValue();
        this.keybindingsSource.next([...currentKeybindings, keybinding]);
    }

    removeKeybinding(id: string) {
        this.http.delete(`${environment.apiUrl}/keybindings/${id}`).subscribe(() => {

        }, (error) => {
            console.error('Error deleting keybinding:', error);
        });

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

    updateKeybinding(id: string, updatedKeybinding: Partial<Keybinding>): Observable<Keybinding> {
        return this.http.put<Keybinding>(`${environment.apiUrl}/keybindings/${id}`, updatedKeybinding)
            .pipe(
                tap((updatedKeybinding: Keybinding) => {
                    const currentKeybindings = this.keybindingsSource.getValue();
                    const updatedKeybindings = currentKeybindings.map(kb =>
                        kb.keybinding_id === id ? updatedKeybinding : kb
                    );
                    this.keybindingsSource.next(updatedKeybindings);
                    localStorage.setItem('keybindings', JSON.stringify(updatedKeybindings));
                })
            );
    }

    updateKeybindingName(id: string, name: string) {
        const currentKeybindings = this.keybindingsSource.getValue();
        const updatedKeybindings = currentKeybindings.map(kb =>
            kb.keybinding_id === id ? { ...kb, name } : kb
        );

        this.keybindingsSource.next(updatedKeybindings);
    }

    // clearKeybinds(keybindingId: string) {
    //     const currentKeybindings = this.keybindingsSource.getValue();
    //     const updatedKeybindings = currentKeybindings.map(kb =>
    //         kb.keybinding_id === keybindingId ? { ...kb, keybinds: [] } : kb
    //     );
    //     this.keybindingsSource.next(updatedKeybindings);
    // }

    createKeybinding(): Observable<Keybinding> {
        console.log('creating keybinding');
        return this.http.post<Keybinding>(`${environment.apiUrl}/keybindings`, {}).pipe(
            tap((newKeybinding: Keybinding) => {
                console.log('after created - newKeybinding', newKeybinding);
                const currentKeybindings = this.keybindingsSource.getValue();
                this.keybindingsSource.next([...currentKeybindings, newKeybinding]);
                //debug this.keybindingsSource
                console.log('this.keybindingsSource', this.keybindingsSource.getValue());
                localStorage.setItem('keybindings', JSON.stringify([...currentKeybindings, newKeybinding]));
            })
        );
    }

    getKeybindings(): Observable<Keybinding[]> {
        console.log('getting keybindings');
        return this.http.get<Keybinding[]>(`${environment.apiUrl}/keybindings`).pipe(
            tap((keybindings: Keybinding[]) => {
                console.log('getKeybindings - keybindings', keybindings);
                this.keybindingsSource.next(keybindings);
                console.log('getKeybindings - this.keybindingsSource', this.keybindingsSource.getValue());
                localStorage.setItem('keybindings', JSON.stringify(keybindings));

            })
        );
    }

    clearKeybindings() {
        this.keybindingsSource.next([]);
        localStorage.removeItem('keybindings');
    }


}
