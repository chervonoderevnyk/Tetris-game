import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { availableAvatars } from '../../assets/emoji-avatars';

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
  selectedAvatar: string = availableAvatars[0]; // Вибрана аватарка за замовчуванням
  isLoginMode: boolean = true;
  message: string = '';
  avatars = availableAvatars; // Список доступних аватарок

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
          this.router.navigate(['/base']);
        },
        error: () => {
          this.message = 'Помилка входу. Перевірте дані.';
        }
      });
    } else {
      this.authService.register(this.username, this.password, this.selectedAvatar).subscribe({
        next: () => {
          this.message = 'Успішна реєстрація! Тепер увійдіть.';
          this.isLoginMode = true;
        },
        error: (err) => {
          this.message = err?.error?.error || 'Помилка реєстрації. Спробуйте ще раз.';
        }
      });
    }
  }
}