import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterCuComponent } from './footer-cu.component';

describe('FooterCuComponent', () => {
  let component: FooterCuComponent;
  let fixture: ComponentFixture<FooterCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterCuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
