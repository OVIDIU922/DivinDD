import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, RegistrationComponent, LoginComponent,
     CompleteProfileComponent, HomeUserComponent, UpdateInfoComponent, 
     ChangePasswordComponent,  DeleteAccountComponent],
   
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'front';
}
