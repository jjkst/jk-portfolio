import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';
import { NgFor } from '@angular/common';
import { FileDownloadService } from '../../services/file-download.service';
import saveAs from 'file-saver';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, FooterComponent, SkillsComponent, NgFor],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent implements OnInit {
  profile: Profile | undefined;

  constructor(
    private profileService: ProfileService,
    private downloadService: FileDownloadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadprofile();
  }

  async loadprofile(): Promise<void> {
    try {
      const response = await this.profileService.getProfile();
      if (response.status === 200 && response.body) {
        this.profile = response.body;
        // OnPush: an assignment from an async callback does not mark the view
        // dirty on its own, so the template would never pick this up.
        this.cdr.markForCheck();
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
