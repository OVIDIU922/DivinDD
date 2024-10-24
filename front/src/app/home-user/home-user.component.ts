import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {

  userProfile: any;

  constructor(private userService: UserService, private router: Router ) {}


  updateInfo() {
    this.router.navigate(['/update-info']);
  }
  
  changePassword() {
    this.router.navigate(['/change-password']);
  }

  deleteAccount() {
    this.router.navigate(['/delete-account'])
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
      }
    );
  }

}
