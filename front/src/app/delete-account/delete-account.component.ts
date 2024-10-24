import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}



  confirmDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      this.userService.deleteAccount().subscribe(
        (response) => {
          console.log('Compte supprimé avec succès:', response);
          alert('Votre compte a été supprimé.');
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Erreur lors de la suppression du compte:', error);
          alert('Erreur lors de la suppression de votre compte.');
        }
      );
    }
  }

}
