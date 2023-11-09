import { TestBed } from '@angular/core/testing';

import { CustsomerService } from './custsomer.service';

describe('CustsomerService', () => {
  let service: CustsomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustsomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
