import { Injectable } from '@angular/core';
import { Ability } from '../types/ability';

@Injectable({
    providedIn: 'root',
})
export class AbilitiesService {

    private abilities: Ability[] = [
        { id: 1, name: 'Fireball', description: 'Shoots a ball of fire.', power: 50, icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_48.jpg' },
        { id: 2, name: 'Ice Shard', description: 'Launches a shard of ice.', power: 40, icon: 'assets/icons/ice_shard.png' },
        { id: 3, name: 'Lightning Bolt', description: 'Strikes with a bolt of lightning.', power: 60, icon: 'assets/icons/lightning_bolt.png' },
    ];

    constructor() { }

    getAbilities(wowClass: string): Ability[] {
        return this.abilities;
    }

    // //gets all proposals
    // getProposals(): Observable<any> {
    //     this.getBackendURL();

    //     const urlString = `${this.apiUrl}/proposal`;

    //     return this.http.get(urlString);
    // }

}
