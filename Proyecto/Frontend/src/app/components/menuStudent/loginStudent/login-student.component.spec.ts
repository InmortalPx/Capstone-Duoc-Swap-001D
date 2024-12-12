import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStudentComponent } from './loginStudent.component';

describe('LoginStudentComponent', () => {
  let component: LoginStudentComponent;
  let fixture: ComponentFixture<LoginStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});