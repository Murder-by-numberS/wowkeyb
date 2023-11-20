import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BackendService } from 'app/core/services/backend.service';
@Component({
    selector     : 'landing-home',
    templateUrl  : './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule],
})
export class LandingHomeComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(private _backendService: BackendService)
    {

        console.log('on the landing page');
    }

    ngOnInit(): void {
        console.log('calling backend');
        this.backendHealthChecker();
    }

    backendHealthChecker() {
        
        this._backendService
        .health()
        .subscribe((health) => {
            console.log('health', health);
        })
    };

}
