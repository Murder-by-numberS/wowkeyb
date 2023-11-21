import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule],
})
export class LandingHomeComponent implements OnInit {
    /**
     * Constructor
     */
    constructor() {

        console.log('on the landing page');
    }

    ngOnInit(): void {
        console.log('calling backend');
        //old

    }

}
