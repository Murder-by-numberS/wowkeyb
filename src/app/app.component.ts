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
    constructor(private _authService: AuthService, private _backendService: BackendService) {

        console.log('APP CONSTRUCTOR');

        try {
            this._authService.initializeBackendURL().subscribe((backend) => {
                console.log('backend', backend);
                // console.log('auth-service - this.apiUrl', this.apiUrl);
                sessionStorage.setItem('backend_url', backend.url);
                //set auth service
                this._authService.setBackendURL();
            });
        } catch (e) {
            console.error(e);
        }

    }

    ngOnInit(): void {
        console.log('app init');

        this.backendHealthChecker();

    }

    backendHealthChecker(): void {

        this._backendService
            .health()
            .subscribe((health) => {
                //TODO: output status to frontend
                console.log('health', health);
            });
    };

}
