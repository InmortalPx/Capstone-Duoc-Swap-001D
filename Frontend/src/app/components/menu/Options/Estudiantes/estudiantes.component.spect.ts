import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RegistroEstudianteComponent } from './estudiantes.component';
import { ConfirmacionDeEmailComponent } from '../confirmacion-de-email/confirmacion-de-email.component';

describe('RegistroEstudianteComponent', () => {
  let component: RegistroEstudianteComponent;
  let fixture: ComponentFixture<RegistroEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroEstudianteComponent, ConfirmacionDeEmailComponent ],
      imports: [
        FormsModule,
        RouterTestingModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate input', () => {
    component.nombreEstudiante = 'Nombre Prueba';
    component.control = 'Control Prueba';
    component.correo = 'Correo';
    expect(component.validateInput()).toBe(false);

    component.correo = 'prueba@gmail.com';
    expect(component.validateInput()).toBe(true);

    component.correo = 'prueba@pintana.cl';
    expect(component.validateInput()).toBe(true);
  });

  it('should open confirmation modal if input is valid', () => {
    spyOn(component, 'openConfirmationModal').and.callThrough();
    component.nombreEstudiante = 'Nombre Prueba';
    component.control = 'Numero Control';
    component.correo = 'prueba@gmail.com';
    component.openConfirmationModal();
    expect(component.openConfirmationModal).toHaveBeenCalled();
    expect(component.showConfirmationModal).toBe(true);
  });

  it('should not open confirmation modal if input is invalid', () => {
    spyOn(component, 'openConfirmationModal').and.callThrough();
    component.nombreEstudiante = '';
    component.control = 'Control Prueba';
    component.correo = 'Correo';
    component.openConfirmationModal();
    expect(component.openConfirmationModal).toHaveBeenCalled();
    expect(component.showConfirmationModal).toBe(false);
  });
});



