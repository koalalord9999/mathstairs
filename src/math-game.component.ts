import { Component, ChangeDetectionStrategy, inject, signal, computed, effect, OnDestroy, untracked, output } from '@angular/core';

import { MathService } from './services/math.service';
import { Level, Problem } from './models';
import { ThinkingIndicatorComponent } from './thinking-indicator.component';

type GameState = 'level-select' | 'playing' | 'showing-answer' | 'game-over';

const TIME_TO_SHOW_QUESTION = 3000; // 3 seconds
const TIME_TO_SHOW_ANSWER = 2000; // 2 seconds
const QUESTIONS_PER_LEVEL = 10;

interface FireworkStar {
  style: string;
}

@Component({
  selector: 'app-math-game',
  templateUrl: './math-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ThinkingIndicatorComponent],
})
export class MathGameComponent implements OnDestroy {
  back = output<void>();
  private mathService = inject(MathService);

  levels = signal<Level[]>(this.mathService.getLevels());
  
  gameState = signal<GameState>('level-select');
  selectedLevel = signal<Level | null>(null);
  problems = signal<Problem[]>([]);
  currentProblemIndex = signal(0);
  
  showFireworks = signal(false);
  fireworks = signal<FireworkStar[]>([]);
  
  levelCompletedCounts = signal<Record<string, number>>({});
  showTooEasyPopup = signal(false);

  totalCompleted = computed(() => {
    const sum = Object.values(this.levelCompletedCounts()).reduce((a, b) => a + b, 0);
    return Math.min(20, sum);
  });
  
  private timeoutId: any = null;
  
  currentProblem = computed(() => {
    const p = this.problems();
    const i = this.currentProblemIndex();
    return p.length > i ? p[i] : null;
  });

  constructor() {
    effect((onCleanup) => {
        const state = this.gameState();

        if (state === 'playing') {
            untracked(() => this.startQuestionTimer());
        } else if (state === 'showing-answer') {
            untracked(() => {
                this.startAnswerTimer();
                if (this.currentProblemIndex() === this.problems().length - 1) {
                    this.triggerFireworks();
                }
            });
        }

        onCleanup(() => {
            untracked(() => this.clearTimeout());
        });
    });
  }

  ngOnDestroy() {
    this.clearTimeout();
  }
  
  selectLevel(level: Level) {
    const count = this.levelCompletedCounts()[level.name] || 0;
    if (['Pink', 'Purple', 'Blue'].includes(level.name) && count >= 2) {
      this.showTooEasyPopup.set(true);
      return;
    }

    this.selectedLevel.set(level);
    this.problems.set(this.mathService.shuffleAndSampleProblems(level.problems, QUESTIONS_PER_LEVEL));
    this.currentProblemIndex.set(0);
    this.showFireworks.set(false);
    this.gameState.set('playing');
  }

  startQuestionTimer() {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.gameState.set('showing-answer');
    }, TIME_TO_SHOW_QUESTION);
  }

  startAnswerTimer() {
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.nextQuestion();
    }, TIME_TO_SHOW_ANSWER);
  }

  nextQuestion() {
    if (this.currentProblemIndex() < this.problems().length - 1) {
      this.currentProblemIndex.update(i => i + 1);
      this.gameState.set('playing');
    } else {
      const level = this.selectedLevel();
      if (level) {
         this.levelCompletedCounts.update(counts => ({
            ...counts,
            [level.name]: (counts[level.name] || 0) + 1
         }));
      }
      this.gameState.set('game-over');
    }
  }

  restart() {
    this.gameState.set('level-select');
    this.selectedLevel.set(null);
    this.problems.set([]);
    this.showFireworks.set(false);
  }

  resetProgress() {
    this.levelCompletedCounts.set({});
  }

  triggerFireworks() {
    const stars: FireworkStar[] = [];
    for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 300;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        stars.push({
            style: `--transform-end: translate(${tx}px, ${ty}px); animation-duration: ${0.5 + Math.random() * 0.5}s;`
        });
    }
    this.fireworks.set(stars);
    this.showFireworks.set(true);
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
