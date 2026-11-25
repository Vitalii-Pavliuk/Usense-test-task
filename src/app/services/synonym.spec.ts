import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SynonymService } from './synonym';

describe('SynonymService', () => {
  let service: SynonymService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(SynonymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});