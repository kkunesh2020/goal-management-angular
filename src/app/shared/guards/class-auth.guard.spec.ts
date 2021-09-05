import { TestBed, async, inject } from '@angular/core/testing';

import { ClassAuthGuard } from './class-auth.guard';

describe('ClassAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassAuthGuard]
    });
  });

  it('should ...', inject([ClassAuthGuard], (guard: ClassAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
