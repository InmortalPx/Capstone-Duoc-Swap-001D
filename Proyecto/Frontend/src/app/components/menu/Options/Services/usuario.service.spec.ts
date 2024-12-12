import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a usuario', () => {
    const dummyUsuario = { NombreCompleto: 'Carlos Lopez', Correo: 'carlos.lopez@example.com', Telefono: '1234567890', IdAdmin: 1223100500, NombreUsuario: 'carlosL', Contrasena: 'password123' };

    service.addUsuario(dummyUsuario).subscribe(response => {
      expect(response).toEqual({ message: 'Usuario registrado exitosamente' });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/usuario`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Usuario registrado exitosamente' });
  });

  it('should update a usuario', () => {
    const dummyUsuario = { NombreCompleto: 'Carlos Lopez', Correo: 'carlos.lopez@example.com', Telefono: '1234567890', IdAdmin: 1223100500, NombreUsuario: 'carlosL', Contrasena: 'password123' };

    service.updateUsuario(1, dummyUsuario).subscribe(response => {
      expect(response).toEqual({ message: 'Usuario actualizado exitosamente' });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/usuario/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Usuario actualizado exitosamente' });
  });

  it('should delete a usuario', () => {
    service.deleteUsuario(1).subscribe(response => {
      expect(response).toEqual({ message: 'Usuario eliminado exitosamente' });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/usuario/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Usuario eliminado exitosamente' });
  });

  it('should search usuarios', () => {
    const dummyResponse = [
      { NombreCompleto: 'Carlos Lopez', Correo: 'carlos.lopez@example.com', Telefono: '1234567890', IdAdmin: 1223100500, NombreUsuario: 'carlosL', Contrasena: 'password123' }
    ];

    service.searchUsuarios({ busqueda: 'Carlos' }).subscribe(response => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}?busqueda=Carlos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });
});
