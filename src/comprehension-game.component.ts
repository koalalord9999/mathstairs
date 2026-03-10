import { Component, ChangeDetectionStrategy, inject, signal, computed, output } from '@angular/core';
import { StoryService, Story, Question } from './services/story.service';

type GameState = 'reading' | 'quiz' | 'game-over';

@Component({
  selector: 'app-comprehension-game',
  templateUrl: './comprehension-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComprehensionGameComponent {
  back = output<void>();
  private storyService = inject(StoryService);

  gameState = signal<GameState>('reading');
  story = signal<Story | null>(null);
  
  currentQuestionIndex = signal(0);
  score = signal(0);
  
  selectedAnswer = signal<string | null>(null);
  showFeedback = signal(false);

  currentQuestion = computed(() => {
    const s = this.story();
    if (!s) return null;
    return s.questions[this.currentQuestionIndex()];
  });

  constructor() {
    this.startNewStory();
  }

  startNewStory() {
    this.story.set(this.storyService.generateStory());
    this.gameState.set('reading');
    this.currentQuestionIndex.set(0);
    this.score.set(0);
    this.selectedAnswer.set(null);
    this.showFeedback.set(false);
  }

  startQuiz() {
    this.gameState.set('quiz');
  }

  selectAnswer(answer: string) {
    if (this.showFeedback()) return;
    
    this.selectedAnswer.set(answer);
    this.showFeedback.set(true);
    
    const q = this.currentQuestion();
    if (q && answer === q.correctAnswer) {
      this.score.update(s => s + 1);
    }

    setTimeout(() => {
      this.nextQuestion();
    }, 2000);
  }

  nextQuestion() {
    const s = this.story();
    if (!s) return;

    if (this.currentQuestionIndex() < s.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
      this.selectedAnswer.set(null);
      this.showFeedback.set(false);
    } else {
      this.gameState.set('game-over');
    }
  }
}
