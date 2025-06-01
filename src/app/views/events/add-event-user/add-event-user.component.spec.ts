import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventUserComponent } from './add-event-user.component';

describe('AddEventUserComponent', () => {
  let component: AddEventUserComponent;
  let fixture: ComponentFixture<AddEventUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
