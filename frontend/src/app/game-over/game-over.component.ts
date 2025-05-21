import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {
  finalScore: number = 0;
  finalLevel: number = 1;

  constructor(private route: ActivatedRoute,  private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.finalScore = +params['score'] || 0;
      this.finalLevel = +params['level'] || 1;
    });
  }

  restartGame(): void {
    this.router.navigate(['/base']);  // Перезапуск гри
  }
}