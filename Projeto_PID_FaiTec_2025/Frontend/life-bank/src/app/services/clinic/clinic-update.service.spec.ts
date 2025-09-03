import { TestBed } from '@angular/core/testing';

import { ClinicUpdateService } from './clinic-update.service';

describe('ClinicUpdateService', () => {
  let service: ClinicUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
