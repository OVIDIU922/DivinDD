import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';




export const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut (page d'accueil)
  { path: 'home', component: HomeComponent },
  { path: 'home-user', component: HomeUserComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'complete-profile/:id', component: CompleteProfileComponent },
  { path: 'update-info', component: UpdateInfoComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'delete-account', component: DeleteAccountComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Ajouter cette ligne
];
