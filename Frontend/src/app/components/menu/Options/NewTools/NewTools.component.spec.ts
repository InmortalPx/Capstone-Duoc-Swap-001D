import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewToolsComponent } from './NewTools.component';
describe('NewToolsComponent', () => {
  let component: NewToolsComponent;
  let fixture: ComponentFixture<NewToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewToolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate SERIE', () => {
    expect(component.validateSERIE('978-3-16-148410-0')).toBe(true);
    expect(component.validateSERIE('9783161484100')).toBe(true);
    expect(component.validateSERIE('978-3-16-148410-X')).toBe(false);
    expect(component.validateSERIE('978316148410X')).toBe(false);
  });

  it('should validate input', () => {
    component.material = 'Material de Prueba';
    component.marca = 'Marca de Prueba';
    component.modelo= '';
    component.categoria = '';
    expect(component.validateInput()).toBe(false);

    component.modelo = 'Modelo de Prueba';
    component.categoria = 'Categoría de Prueba';
    expect(component.validateInput()).toBe(true);
  });
});

