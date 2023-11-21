import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './core/auth/auth.service';
import { BackendService } from './core/services/backend.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(private authService: AuthService, public _backendService: BackendService) {
    }

    ngOnInit(): void {
        console.log('app init');

        try {
            this.authService.initializeBackendURL().subscribe((backend) => {
                console.log('backend', backend);
                // console.log('auth-service - this.apiUrl', this.apiUrl);
                sessionStorage.setItem('backend_url', backend.url);
                //set auth service
                this.authService.setBackendURL();
            });
        } catch (e) {
            console.error(e);
        }

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
