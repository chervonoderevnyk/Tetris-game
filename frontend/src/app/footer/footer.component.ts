import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [HttpClientModule, CommonModule], // Додано HttpClientModule і CommonModule
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isModalOpen = false;
  rulesContent: string = '';

  constructor(private http: HttpClient) {}

  openRulesModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = true;

    // Завантаження правил з файлу rules.md
    this.http.get('assets/docs/rules.md', { responseType: 'text' }).subscribe({
      next: (data) => {
        this.rulesContent = this.convertMarkdownToHtml(data);
      },
      error: (err) => {
        console.error('Не вдалося завантажити правила гри:', err);
        this.rulesContent = '<p>Не вдалося завантажити правила гри.</p>';
      }
    });
  }

  closeRulesModal(): void {
    this.isModalOpen = false;
  }

  private convertMarkdownToHtml(markdown: string): string {
    // Простий конвертер Markdown у HTML (можна замінити на бібліотеку, наприклад, marked.js)
    return markdown.replace(/\n/g, '<br>').replace(/## (.+)/g, '<h2>$1</h2>');
  }
}