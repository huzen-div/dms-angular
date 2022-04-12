import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubfileComponent } from './subfile.component';

describe('SubfileComponent', () => {
  let component: SubfileComponent;
  let fixture: ComponentFixture<SubfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
