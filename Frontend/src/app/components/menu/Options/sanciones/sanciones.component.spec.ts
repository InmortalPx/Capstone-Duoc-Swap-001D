import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SancionesComponent } from './sanciones.component';
import { Component } from '@angular/core';

describe('SancionesComponent', () => {
  let component: SancionesComponent;
  let fixture: ComponentFixture<SancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SancionesComponent],
      imports: [FormsModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(SancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
  expect(component.sancion.alumno).toBe('');
    expect(component.sancion.noControl).toBe('');
    expect(component.sancion.correo).toBe('');
    expect(component.sancion.cantSanciones).toBe(0);
    expect(component.sancion.adeudoTotal).toBe(0);
    expect(component.sancion.fechaConsulta).toBe('');
    expect(component.sancion.diasTranscurridos).toBe(0);
  });

  it('should call generarReporte method when "Generar Reporte" button is clicked', () => {
    spyOn(component, 'generarReporte');
    const button = fixture.debugElement.nativeElement.querySelector('button.btn-secondary');
    button.click();
    expect(component.generarReporte).toHaveBeenCalled();
  });

  it('should call registrar method when form is submitted', () => {
    spyOn(component, 'registrar');
    const form = fixture.debugElement.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.registrar).toHaveBeenCalled();
  });
