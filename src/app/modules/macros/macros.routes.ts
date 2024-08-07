import { Routes } from '@angular/router';
import { MacrosComponent } from './macros.component';

export default [
    {
        path: 'view',
        component: MacrosComponent,
    },
    {
        path: 'create',
        component: MacrosComponent,
    },
] as Routes;
