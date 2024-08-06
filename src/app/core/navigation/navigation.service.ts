import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from 'environments/environment';
@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    apiUrl: string;

    constructor() {
        this.getBackendURL();

        console.log('BackendService - this.apiUrl', this.apiUrl);
    }

    getBackendURL(): void {
        if (environment.production === true) {
            this.apiUrl = sessionStorage.getItem('backend_url');
        } else {
            this.apiUrl = environment.apiUrl;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        //TODO: remove, using the backend
        // return this._httpClient.get<Navigation>('api/common/navigation').pipe(
        return this._httpClient.get<Navigation>(`${this.apiUrl}/navigation`).pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }
}
