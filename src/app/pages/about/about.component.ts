import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { NgFor } from '@angular/common';
import { FileDownloadService } from '../../services/file-download.service';
import saveAs from 'file-saver';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, FooterComponent, SkillsComponent, NgFor],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  profile: Profile | undefined;
  routerSub: Subscription | undefined;

  constructor(
    private profileService: ProfileService,
    private downloadService: FileDownloadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

ngOnInit(): void {
  this.loadprofile();

  this.routerSub = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    filter(() => this.router.url === '/about')
  ).subscribe(() => {
    this.loadprofile();
  });
}

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  async loadprofile(): Promise<void> {
    try {
      const response = await this.profileService.getProfile();
      if (response.status === 200 && response.body) {
        this.profile = response.body;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async onDownloadClick() {
    try {
      const response = await this.downloadService.downloadFile();
      if (response.body) {
        saveAs(response.body, 'karthik-resume.pdf');
      } else {
        console.error('No file data received.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
}
