import { Routes } from '@angular/router';
import { KeybindsComponent } from './keybinds.component';

export default [
    {
        path: 'view',
        component: KeybindsComponent,
    },
    {
        path: 'create',
        component: KeybindsComponent,
    },
] as Routes;
