import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { 
    this.registrationForm = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
 
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }

    const pseudo = this.registrationForm.value.pseudo;
    const password = this.registrationForm.value.password;

    // Envoyer les données d'inscription au backend
    this.http.post('http://localhost:3000/api/register', { pseudo, password }).subscribe(
      response => {
        alert('Inscription réussie');
        this.router.navigate(['/login']);
        // Rediriger vers une autre page ou afficher un message de succès
      },
      error => {
        alert('Erreur lors de l\'inscription');

        // Afficher un message d'erreur à l'utilisateur ou prendre une autre action
      }
    );
  }
}
