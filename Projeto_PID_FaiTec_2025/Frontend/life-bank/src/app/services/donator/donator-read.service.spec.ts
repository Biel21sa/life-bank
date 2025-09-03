import { TestBed } from '@angular/core/testing';

import { DonatorReadService } from './donator-read.service';

describe('DonatorReadService', () => {
  let service: DonatorReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonatorReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
