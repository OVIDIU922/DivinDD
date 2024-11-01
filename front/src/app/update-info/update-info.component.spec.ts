import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInfoComponent } from './update-info.component';

describe('UpdateInfoComponent', () => {
  let component: UpdateInfoComponent;
  let fixture: ComponentFixture<UpdateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
