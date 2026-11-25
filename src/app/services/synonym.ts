import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';
import { Synonym } from '../models/synonym.model';

@Injectable({
  providedIn: 'root'
})
export class SynonymService {

  private http = inject(HttpClient);

  private apiUrl = 'https://api.datamuse.com/words';

  getSynonyms(text: string): Observable<Synonym[]> {
    const query = text.trim();

    if (/\s/.test(query)) {
      return this.getSimilarWords(query);
    }

    return this.http.get<Synonym[]>(this.apiUrl, {
      params: {
        rel_syn: query,
        max: 15
      }
    }).pipe(
      switchMap(results => {
        if (results.length > 0) {
          return of(results);
        }

        return this.getSimilarWords(query);
      })
    );
  }

  private getSimilarWords(text: string): Observable<Synonym[]> {
    return this.http.get<Synonym[]>(this.apiUrl, {
      params: {
        ml: text,
        max: 15
      }
    });
  }
}