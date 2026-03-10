import { Injectable } from '@angular/core';
import { STORIES } from './stories';

export interface Story {
  text: string[];
  questions: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

@Injectable({ providedIn: 'root' })
export class StoryService {
  private adjectives = ['happy', 'shiny', 'bumpy', 'sparkly', 'bright', 'sharp', 'wet', 'grumpy', 'gentle', 'beautiful', 'colorful', 'ancient', 'famous', 'curious', 'brave'];
  private nouns = ['robot', 'submarine', 'dinosaur', 'pizza', 'laser', 'crown', 'gadget', 'squirrel', 'acorn', 'fish', 'violin', 'guitar', 'telescope', 'pumpkin', 'soccer ball', 'cake', 'piano', 'flute', 'plant'];
  private verbs = ['explores', 'polishes', 'detects', 'ventures', 'packs', 'finds', 'squeezes', 'presses', 'watches', 'shares', 'practices', 'composes', 'performs', 'fixes', 'teaches', 'plants', 'tends'];

  generateStory(): Story {
    const story = { ...STORIES[Math.floor(Math.random() * STORIES.length)] };
    const replacements: { [key: string]: string } = {};
    
    // Scan all text and questions for placeholders and pre-generate values
    const allText = [...story.text, ...story.questions.map(q => q.question), ...story.questions.flatMap(q => q.options), ...story.questions.map(q => q.correctAnswer)].join(' ');
    const placeholderRegex = /{{(\w+)}}/g;
    let match;
    while ((match = placeholderRegex.exec(allText)) !== null) {
      const key = match[1];
      if (!replacements[key]) {
        let val = '';
        if (key.startsWith('adj')) val = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
        else if (key.startsWith('noun')) val = this.nouns[Math.floor(Math.random() * this.nouns.length)];
        else if (key.startsWith('verb')) val = this.verbs[Math.floor(Math.random() * this.verbs.length)];
        
        // Store as lowercase
        replacements[key] = val.toLowerCase();
      }
    }
    
    // Replace placeholders in text
    story.text = story.text.map(paragraph => this.replacePlaceholders(paragraph, replacements, false));
    
    // Select 3 random questions, replace placeholders, and randomize options
    story.questions = story.questions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(q => {
        const options = [...q.options].sort(() => 0.5 - Math.random());
        return {
          question: this.replacePlaceholders(q.question, replacements, true),
          options: options.map(o => this.replacePlaceholders(o, replacements, true)),
          correctAnswer: this.replacePlaceholders(q.correctAnswer, replacements, true)
        };
      });
      
    return story;
  }

  private replacePlaceholders(text: string, replacements: { [key: string]: string }, forceCapitalize: boolean): string {
    return text.replace(/{{(\w+)}}/g, (match, key, offset) => {
      const val = replacements[key];
      if (!val) return match;

      if (forceCapitalize) {
        return val.charAt(0).toUpperCase() + val.slice(1);
      }
      
      // Check if it should be capitalized based on context
      const isStart = offset === 0;
      const followsPeriod = offset >= 2 && text.substring(offset - 2, offset) === '. ';
      
      if (isStart || followsPeriod) {
        return val.charAt(0).toUpperCase() + val.slice(1);
      }
      
      return val;
    });
  }
}
