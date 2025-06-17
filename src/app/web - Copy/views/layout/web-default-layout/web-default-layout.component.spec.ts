import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebDefaultLayoutComponent } from './web-default-layout.component';

describe('WebDefaultLayoutComponent', () => {
  let component: WebDefaultLayoutComponent;
  let fixture: ComponentFixture<WebDefaultLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebDefaultLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
