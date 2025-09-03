import { TestBed } from '@angular/core/testing';

import { DonatorUpdateService } from './donator-update.service';

describe('DonatorUpdateService', () => {
  let service: DonatorUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonatorUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
