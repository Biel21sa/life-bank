import { TestBed } from '@angular/core/testing';

import { DonatorDeleteService } from './donator-delete.service';

describe('DonatorDeleteService', () => {
  let service: DonatorDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonatorDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
