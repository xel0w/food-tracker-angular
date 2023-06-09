import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formulaire: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) {
    this.formulaire = this.formBuilder.group({
      pseudo: '',
      password: ''
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/food-tracker']);
    }
  }

  login() {

    const { pseudo, password } = this.formulaire.value;

    console.log(this.formulaire);
    

    this.http.post<any>('http://localhost:3000/api/login', { pseudo, password }).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/food-tracker']);
      },
      error => {
        console.error(error);
        alert("Mauvais pseudo / mot de passe")
      }
    );
  }
  goRegister(){
    this.router.navigate(['/registration']);
  }
}
