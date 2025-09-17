import { Component, OnInit, OnDestroy } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [CommonModule, MaterialModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
isMenuOpen = false;
  isSubMenuOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  isOwner = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setupAuthSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupAuthSubscription(): void {
    // this.authService.user$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (user) => {
    //       this.isLoggedIn = !!user;
    //       this.isAdmin = user?.Role === UserRole.Admin;
    //       this.isOwner = user?.Role === UserRole.Owner;
    //     },
    //     error: (error) => {
    //       console.error('Error in auth subscription:', error);
    //       this.isLoggedIn = false;
    //       this.isAdmin = false;
    //       this.isOwner = false;
    //     }
    //   });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleSubMenu(): void {
    this.isSubMenuOpen = !this.isSubMenuOpen; 
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.isSubMenuOpen = false; 
  }

  async logout(): Promise<void> {
    try {
      //await this.authService.logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

}
