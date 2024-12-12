import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NewToolsComponent } from './newtools.component';

describe('NewToolsComponent', () => {
  let component: NewToolsComponent;
  let fixture: ComponentFixture<NewToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewToolsComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form correctly', () => {
    component.nombreHerramienta = 'Test Tool';
    component.marca = 'Test Brand';
    component.categoria = 'Electrónica';
    component.informacion = 'Some info';
    component.ejemplares = 5;
    component.tipo = 'intercambio';
    component.resetForm();

    expect(component.nombreHerramienta).toBe('');
    expect(component.marca).toBe('');
    expect(component.categoria).toBe('');
    expect(component.informacion).toBe('');
    expect(component.ejemplares).toBeNull();
    expect(component.tipo).toBe('');
    expect(component.portada).toBeNull();
  });

  it('should call saveTool method and reset form on valid submission', () => {
    component.nombreHerramienta = 'Test Tool';
    component.marca = 'Test Brand';
    component.categoria = 'Electrónica';
    component.ejemplares = 1;
    component.tipo = 'intercambio';
    spyOn(window, 'alert');
    spyOn(component, 'resetForm');

    component.saveTool();

    expect(window.alert).toHaveBeenCalledWith('Material o regalo registrado exitosamente.');
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('should display alert on incomplete submission', () => {
    component.nombreHerramienta = ''; // Campo requerido vacío
    spyOn(window, 'alert');

    component.saveTool();

    expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos requeridos.');
  });
});
