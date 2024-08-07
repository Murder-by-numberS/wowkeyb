import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
    ViewChild
} from '@angular/core';
import {
    NgForm,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        FuseAlertComponent,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    @ViewChild('changePasswordNgForm') changePasswordNgForm: NgForm;
    countdown: number = 1;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    changePasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, private _authService: AuthService) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.changePasswordForm = this._formBuilder.group({
            currentPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            verifyNewPassword: ['', Validators.required]
            // twoStep: [true],
            // askPasswordChange: [false],
        },
            {
                validators: FuseValidators.mustMatch(
                    'newPassword',
                    'verifyNewPassword'
                ),
            }
        );

        //turn off alert
        this.changePasswordForm.valueChanges.subscribe(() => {
            this.showAlert = false;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
   * Change password
   */
    changePassword(): void {

        // Return if the form is invalid
        if (this.changePasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.changePasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        const passwordPayload = {
            op: this.changePasswordForm.get('currentPassword').value,
            np: this.changePasswordForm.get('newPassword').value,
        };

        // Send the request to the server
        this._authService
            .changePassword(passwordPayload)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.changePasswordForm.enable();

                    // Reset the form
                    this.changePasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been successfully changed!',
                    };

                    // disable the form
                    this.changePasswordForm.disable();

                    // turn off alert after the countdown
                    timer(3000, 3000)
                        .pipe(
                            finalize(() => {
                                //turn off alert
                                this.showAlert = false;
                            }),
                            takeWhile(() => this.countdown > 0),
                            takeUntil(this._unsubscribeAll),
                            tap(() => this.countdown--)
                        )
                        .subscribe();

                },
                (response) => {

                    console.log('response', response);

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: response.error.error ? response.error.error[0].msg : response.error.message,
                    };

                }
            );
    }
}
