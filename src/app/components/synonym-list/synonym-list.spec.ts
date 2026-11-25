import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SynonymList } from './synonym-list';

describe('SynonymList', () => {
  let component: SynonymList;
  let fixture: ComponentFixture<SynonymList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynonymList],
    }).compileComponents();

    fixture = TestBed.createComponent(SynonymList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
