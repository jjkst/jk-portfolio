import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { SkillsComponent } from '../../components/skills/skills.component';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, FooterComponent, SkillsComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
