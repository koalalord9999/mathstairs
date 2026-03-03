import { Component, ChangeDetectionStrategy, OnDestroy, OnInit, signal, input } from '@angular/core';

@Component({
  selector: 'thinking-indicator',
  standalone: true,
  template: `{{ baseText() }}{{ dots() }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThinkingIndicatorComponent implements OnInit, OnDestroy {
  baseText = input.required<string>();
  dots = signal('');
  private intervalId: any;

  ngOnInit() {
    this.dots.set('.');
    this.intervalId = setInterval(() => {
      this.dots.update(d => d.length < 3 ? d + '.' : '.');
    }, 400);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
