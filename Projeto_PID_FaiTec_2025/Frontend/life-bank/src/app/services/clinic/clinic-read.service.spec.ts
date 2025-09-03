import { TestBed } from '@angular/core/testing';

import { ClinicReadService } from './clinic-read.service';

describe('ClinicReadService', () => {
  let service: ClinicReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
