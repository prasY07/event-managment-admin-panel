import { TestBed } from '@angular/core/testing';

import { SocialSourceService } from './social-source.service';

describe('SocialSourceService', () => {
  let service: SocialSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
