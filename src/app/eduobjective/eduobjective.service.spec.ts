import { TestBed } from '@angular/core/testing';

import { EduobjectiveService } from './eduobjective.service';

describe('EduobjectiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EduobjectiveService = TestBed.get(EduobjectiveService);
    expect(service).toBeTruthy();
  });
});
