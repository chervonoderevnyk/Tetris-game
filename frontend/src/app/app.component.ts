import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { BaseComponent } from './base/base.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BaseComponent],
  template: `<app-base></app-base>`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {}
