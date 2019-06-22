import { TestBed } from '@angular/core/testing';

import { SkillsetService } from './skillset.service';

describe('SkillsetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SkillsetService = TestBed.get(SkillsetService);
    expect(service).toBeTruthy();
  });
});
