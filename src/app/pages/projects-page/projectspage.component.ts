import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { Project } from '../../models/project.modal';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-projectspage',
  imports: [HeaderComponent, CommonModule, MaterialModule, FooterComponent],
  templateUrl: './projectspage.component.html',
  styleUrl: './projectspage.component.scss',
})
export class ProjectsPageComponent implements OnInit {
  projects: Project[] = [];

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadproducts();
  }

  async loadproducts(): Promise<void> {
    try {
      const response = await this.productService.getProjects();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.projects =
          response.body.map((product) => ({
            ID: product.ID,
            Title: product.Title,
            Type: product.Type,
            Description: product.Description,
            FileName: product.FileName,
            ProjectUrl: product.ProjectUrl
          })) || [];
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  goToProject(projectId: number) {
    this.router.navigate(['/project', projectId]);
  }
}
