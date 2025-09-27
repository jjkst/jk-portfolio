import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.modal';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, FooterComponent, SkillsComponent, NgFor],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  profile: Profile | undefined;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadprofile();
  }

  async loadprofile(): Promise<void> {
    try {
      const response = await this.profileService.getProfile();
      if (response.status === 200) {
        this.profile = {
          Title: response.body.Title,
          Description: response.body.Description,
          SummaryTitle: response.body.SummaryTitle,
          Summary: response.body.Summary,
        };
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }
}
