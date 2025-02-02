import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { of, BehaviorSubject } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tokenSubject: BehaviorSubject<string | null>;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', ['getSecret']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getTokenObservable']);
    
    tokenSubject = new BehaviorSubject<string | null>(null);
    authServiceSpy.getTokenObservable.and.returnValue(tokenSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        provideToastr(),
        { provide: DataService, useValue: dataServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset secret when token is null', () => {
    tokenSubject.next(null);
    fixture.detectChanges();
    expect(component.secret).toBe('');
  });

  it('should fetch secret when revealSecret is called', () => {
    const mockSecret = 'This is a secret!';
    dataServiceSpy.getSecret.and.returnValue(of(mockSecret));

    component.revealSecret();

    expect(dataServiceSpy.getSecret).toHaveBeenCalled();
    expect(component.secret).toBe(mockSecret);
  });

  it('should unsubscribe from tokenSubscription on destroy', () => {
    spyOn(component['tokenSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['tokenSubscription'].unsubscribe).toHaveBeenCalled();
  });
});