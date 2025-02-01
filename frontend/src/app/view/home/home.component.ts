import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { DataService } from '../../shared/services/data.service';
import { AuthService } from '../../shared/services/auth.service';
import { first, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  public secret!: string;
  private tokenSubscription!: Subscription;

  constructor(
    private dataService: DataService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tokenSubscription = this.authService.getTokenObservable().subscribe(token => {
      if (!token) {
        this.secret = ''; 
      }
    });
  }

  revealSecret() {
    this.dataService.getSecret().pipe(first()).subscribe(response => {
      this.secret = response;
    });
  }

  ngOnDestroy() {
    this.tokenSubscription.unsubscribe(); 
  }
}