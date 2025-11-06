import { TestBed } from '@angular/core/testing';

import { FeedSourceService } from './feed-source.service';

describe('FeedSourceService', () => {
  let service: FeedSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
