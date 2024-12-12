import { TestBed } from '@angular/core/testing';

import { PublicacionMensajeService } from './publicacion-mensaje.service';

describe('PublicacionMensajeService', () => {
  let service: PublicacionMensajeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicacionMensajeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
