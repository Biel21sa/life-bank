import { TestBed } from '@angular/core/testing';

import { ClinicDeleteService } from './clinic-delete.service';

describe('UserDeleteService', () => {
  let service: ClinicDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
