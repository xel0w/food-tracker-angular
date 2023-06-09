import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  pseudo: string | null;

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.pseudo = decodedToken.pseudo;
    } else {
      this.pseudo = null;
    }
  }
  ngOnInit(): void {}

  logout(): void {
    localStorage.removeItem('token');
    alert('Vous etes déconnecté')
    this.router.navigate(['/']);
  }
  goLogin(): void{
    this.router.navigate(['login']);
  }
  goListe(): void{
    this.router.navigate(['liste']);
  }
  goHome(): void{
    this.router.navigate(['']);
  }
  goPerso(): void{
    this.router.navigate(['food-tracker']);
  }
}