import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChatsComponent } from './chats.component';
import { Component } from '@angular/core';

describe('ChatsComponent', () => {
  let component: ChatsComponent;
  let fixture: ComponentFixture<ChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatsComponent],
      imports: [FormsModule]
    })
    .compileComponents();
    fixture = TestBed.createComponent(ChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial values', () => {
  expect(component.Chat.alumno).toBe('');
    expect(component.Chat.noControl).toBe('');
    expect(component.Chat.correo).toBe('');
    expect(component.Chat.cantChats).toBe(0);
    expect(component.Chat.adeudoTotal).toBe(0);
    expect(component.Chat.fechaConsulta).toBe('');
    expect(component.Chat.diasTranscurridos).toBe(0);
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
