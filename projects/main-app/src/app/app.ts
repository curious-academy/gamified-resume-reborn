import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component of the application
 * Serves as the main container for the application
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('Gamified Resume Reborn');

  // private readonly sig1 = signal('Hello');
  // private readonly sig2 = signal('World');

  // protected readonly result = computed(() => `${this.sig1()} ${this.sig2()}`);
}
