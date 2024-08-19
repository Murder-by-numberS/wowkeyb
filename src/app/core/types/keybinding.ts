import { Keybind } from "./keybind";

export interface Keybinding {
    id: string,
    name: string;
    class: string; //TODO: ENUM
    spec?: string; //TODO: ENUM
    heroTalent?: string;  //TODO: ENUM
    keybinds: Keybind[];
}
