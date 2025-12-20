import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFunctionComponent } from './update-function.component';

describe('UpdateFunctionComponent', () => {
  let component: UpdateFunctionComponent;
  let fixture: ComponentFixture<UpdateFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateFunctionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
