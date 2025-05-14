import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  username: string = '';
  password: string = '';
  isLoginMode: boolean = true; // Перемикач між логіном і реєстрацією
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Submitted', this.username, this.password);

          this.authService.saveToken(response.tokenA);
          this.router.navigate(['/base']); // Перенаправлення на BaseComponent
        },
        error: () => {
          this.message = 'Помилка входу. Перевірте дані.';
        }
      });
    } else {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          this.message = 'Успішна реєстрація! Тепер увійдіть.';
          this.isLoginMode = true;
        },
        error: () => {
          this.message = 'Помилка реєстрації. Спробуйте ще раз.';
        }
      });
    }
  }
}
