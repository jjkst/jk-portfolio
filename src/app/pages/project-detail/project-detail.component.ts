import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Project } from '../../models/project.modal';

@Component({
  selector: 'app-project-detail',
  imports: [HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadproduct();
  }

  async loadproduct(): Promise<void> {
    try {
      const response = await this.productService.getProjectById(6);
      if (response.status === 200 && response.body) {
          this.project = {  
            ID: response.body?.ID,
            Title: response.body?.Title,
            Subtitle: response.body?.Subtitle,
            Type: response.body?.Type,
            Roles: response.body?.Roles,
            Tools: response.body?.Tools,
            LiveLink: response.body?.LiveLink,
            Description: response.body?.Description,
            FileName: response.body?.FileName,
            ProjectUrl: response.body?.ProjectUrl
          };
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  goToProject(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }
}
