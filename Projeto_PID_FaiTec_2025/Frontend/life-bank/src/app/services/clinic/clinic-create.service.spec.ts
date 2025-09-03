import { TestBed } from '@angular/core/testing';

import { ClinicCreateService } from './clinic-create.service';

describe('UserCreateService', () => {
  let service: ClinicCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
