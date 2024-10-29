import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionDeToolsComponent } from './devolucion-de-tools.component';

describe('DevolucionDeToolsComponent', () => {
  let component: DevolucionDeToolsComponent;
  let fixture: ComponentFixture<DevolucionDeToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DevolucionDeToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevolucionDeToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
