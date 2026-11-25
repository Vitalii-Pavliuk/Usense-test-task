import { Component, input, output } from '@angular/core';
import { Synonym } from '../../models/synonym.model';

@Component({
  selector: 'app-synonym-list',
  imports: [],
  templateUrl: './synonym-list.html',
  styleUrl: './synonym-list.scss'
})
export class SynonymList {

  synonyms = input.required<Synonym[]>();
  selectedText = input.required<string>();

  synonymSelected = output<string>();

  selectSynonym(word: string): void {
    this.synonymSelected.emit(word);
  }
}