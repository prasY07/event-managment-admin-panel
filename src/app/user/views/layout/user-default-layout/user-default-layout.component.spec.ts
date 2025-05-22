import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefaultLayoutComponent } from './user-default-layout.component';

describe('UserDefaultLayoutComponent', () => {
  let component: UserDefaultLayoutComponent;
  let fixture: ComponentFixture<UserDefaultLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDefaultLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
