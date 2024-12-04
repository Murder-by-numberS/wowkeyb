export interface Ability {
    id: number;
    spellId: number;
    name: string;
    description: string;
    power: number;
    icon: string;  // Path or URL to the icon image,
    keybinding: string;
}
