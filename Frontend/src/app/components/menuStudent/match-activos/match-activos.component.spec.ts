import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchActivosComponent } from './match-activos.component';

describe('MatchActivosComponent', () => {
  let component: MatchActivosComponent;
  let fixture: ComponentFixture<MatchActivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchActivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
