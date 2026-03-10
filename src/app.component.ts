import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

import { MathGameComponent } from './math-game.component';
import { ComprehensionGameComponent } from './comprehension-game.component';

type AppMode = 'home' | 'math' | 'comprehension';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MathGameComponent, ComprehensionGameComponent],
})
export class AppComponent {
  appMode = signal<AppMode>('home');
}
