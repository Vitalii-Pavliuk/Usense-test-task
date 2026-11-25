import {
  Component,
  signal,
  viewChild,
  ElementRef,
  inject,
  DestroyRef
} from '@angular/core';

import { Subscription, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TextStats } from '../text-stats/text-stats';
import { SynonymList } from '../synonym-list/synonym-list';
import { SynonymService } from '../../services/synonym';
import { Synonym } from '../../models/synonym.model';

@Component({
  selector: 'app-text-editor',
  imports: [TextStats, SynonymList],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.scss'
})
export class TextEditor {

  private synonymService = inject(SynonymService);
  private destroyRef = inject(DestroyRef);
  private request?: Subscription;

  text = signal('');
  selectedText = signal('');

  selectionStart = signal(0);
  selectionEnd = signal(0);

  synonyms = signal<Synonym[]>([]);
  isLoading = signal(false);
  error = signal('');
  hasSearched = signal(false);

  copyMessage = signal('');

  textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  onTextChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.text.set(textarea.value);
    this.copyMessage.set('');

    this.resetSelection();
    this.resetSearch();
  }

  onTextSelect(): void {
    const textarea = this.textarea()?.nativeElement;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (
      start !== this.selectionStart() ||
      end !== this.selectionEnd()
    ) {
      this.resetSearch();
    }

    this.selectionStart.set(start);
    this.selectionEnd.set(end);
    this.selectedText.set(textarea.value.slice(start, end));
  }

  findSynonyms(): void {
    const selected = this.selectedText().trim();

    if (!selected || this.isLoading()) return;

    this.resetSearch();

    this.isLoading.set(true);
    this.hasSearched.set(true);

    this.request = this.synonymService.getSynonyms(selected)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.synonyms.set(data);
        },
        error: () => {
          this.error.set('Failed to load synonyms. Please try again.');
        }
      });
  }

  replaceText(synonym: string): void {
    if (!this.selectedText().trim()) return;

    const currentText = this.text();
    const start = this.selectionStart();
    const end = this.selectionEnd();

    if (currentText.slice(start, end) !== this.selectedText()) {
      return;
    }

    const before = currentText.slice(0, start);
    const after = currentText.slice(end);

    const newText = before + synonym + after;

    this.text.set(newText);
    this.copyMessage.set('');

    this.resetSelection();
    this.resetSearch();
  }

  async copyText(): Promise<void> {
    if (!this.text()) return;

    try {
      await navigator.clipboard.writeText(this.text());

      this.copyMessage.set('Text copied successfully!');
    } catch {
      this.copyMessage.set('Failed to copy text.');
    }
  }

  private resetSelection(): void {
    this.selectedText.set('');
    this.selectionStart.set(0);
    this.selectionEnd.set(0);
  }

  private resetSearch(): void {
    this.request?.unsubscribe();

    this.synonyms.set([]);
    this.error.set('');
    this.isLoading.set(false);
    this.hasSearched.set(false);
  }
}