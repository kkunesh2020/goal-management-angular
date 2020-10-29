import { TestBed } from '@angular/core/testing';

import { GoalStudentDataService } from './goal-student-data.service';

describe('GoalStudentDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoalStudentDataService = TestBed.get(GoalStudentDataService);
    expect(service).toBeTruthy();
  });
});
