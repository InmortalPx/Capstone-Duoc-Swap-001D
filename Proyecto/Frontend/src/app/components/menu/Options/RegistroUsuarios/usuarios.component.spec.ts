import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroUsuariosComponent } from './usuarios.component';

describe('RegistroUsuariosComponent', () => {
  let component: RegistroUsuariosComponent;
  let fixture: ComponentFixture<RegistroUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroUsuariosComponent],

    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate Usuario', () => {
        expect(component.saveUsuario()) 
  });

});
