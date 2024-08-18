import { Keybind } from "./keybind";

export interface Keybinding {
    id: string,
    name: string;
    class: string; //TODO: ENUM
    keybinds: Keybind[];
}
