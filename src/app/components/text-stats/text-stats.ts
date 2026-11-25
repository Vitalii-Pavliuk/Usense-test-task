import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-text-stats',
  imports: [],
  templateUrl: './text-stats.html',
  styleUrl: './text-stats.scss'
})
export class TextStats {

  text = input.required<string>();
  characterCount = computed(() => this.text().length);
  wordCount = computed(() => {
    const value = this.text().trim();
    if (value === '') {
      return 0;
    }
    return value.split(/\s+/).length;
  });

}