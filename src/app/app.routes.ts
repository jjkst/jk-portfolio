import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsPageComponent } from './pages/projects-page/projectspage.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ContactComponent } from './pages/contact/contact.component';

import { ProductService } from './services/product.service';
import { inject } from '@angular/core';
export async function getProjectIds(): Promise<string[]> {
  const productService = inject(ProductService);

  try {
    const response = await productService.getProjectIds();
    
    if (response?.status === 200 && Array.isArray(response.body)) {
      return response.body.map(product => product.ID.toString());
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch project IDs:', error);
    return [];
  }
}

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'project/:id', component: ProjectDetailComponent,
    data: {
      prerender: true,
      getPrerenderParams: getProjectIds
    }
   },
  { path: '**', redirectTo: '' }
];