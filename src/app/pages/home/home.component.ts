import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnimateOnScrollDirective } from '../../directives/animate-on-scroll.directive';
import { SkillsComponent } from '../../components/skills/skills.component';
import { ProjectsComponent } from '../../components/projects/projects.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeroComponent } from '../../components/hero/hero.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    HeroComponent,
    SkillsComponent,
    ProjectsComponent,
    HeaderComponent,
    FooterComponent,
    AnimateOnScrollDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
