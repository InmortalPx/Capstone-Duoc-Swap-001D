import { IntercambioService } from './reporte.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('IntercambioService', () => {
  let service: IntercambioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IntercambioService]
    });

    service = TestBed.inject(IntercambioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch loan data successfully', () => {
    const dummyLoans = [
      { id: 1, toolTitle: 'Material 1', borrowerName: 'Estudiante 1', dateLoaned: '2024-08-01' },
      { id: 2, toolTitle: 'Material 2', borrowerName: 'Estudiante 2', dateLoaned: '2024-08-02' }
    ];

    service.getIntercambios().subscribe(loans => {
      expect(loans.length).toBe(2);
      expect(loans).toEqual(dummyLoans);
    });

    const req = httpMock.expectOne(`${service}/loans`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyLoans);
  });

  it('should handle errors correctly', () => {
    service.getIntercambios().subscribe(
      () => fail('should have failed with the 500 error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${service}/intercambios`);
    expect(req.request.method).toBe('GET');
    req.flush('Error loading loan data', { status: 500, statusText: 'Server Error' });
  });
});
