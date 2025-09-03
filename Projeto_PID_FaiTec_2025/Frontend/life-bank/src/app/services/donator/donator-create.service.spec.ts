import { TestBed } from '@angular/core/testing';

import { DonatorCreateService } from './donator-create.service';

describe('DonatorCreateService', () => {
  let service: DonatorCreateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonatorCreateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
