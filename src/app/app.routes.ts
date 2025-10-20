import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsPageComponent } from './pages/projects-page/projectspage.component';
import { AboutComponent } from './pages/about/about.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FeatureComponent } from './pages/feature/feature.component';
import { AvailabilityManagerComponent } from './components/availability-manager/availability-manager.component';
import { ServiceManagerComponent } from './components/service-manager/service-manager.component';
import { ScheduleManagerComponent } from './components/schedule-manager/schedule-manager.component';

import { ProjectService } from './services/project.service';
import { inject } from '@angular/core';

export async function getProjectIds(): Promise<string[]> {
  const projectService = inject(ProjectService);

  try {
    const response = await projectService.getProjectIds();
    
    if (response?.status === 200 && Array.isArray(response.body)) {
      return response.body.map(project => project.Id.toString());
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
  { path: 'features', component: FeatureComponent,
    children: [
      { path: '', redirectTo: 'service-manager', pathMatch: 'full' },
      { path: 'service-manager', component: ServiceManagerComponent },
      { path: 'availability-manager', component: AvailabilityManagerComponent },
      { path: 'schedule-manager', component: ScheduleManagerComponent }
    ] },
  { path: 'project/:id', component: ProjectDetailComponent,
    data: {
      prerender: true,
      getPrerenderParams: getProjectIds
    }
   },
  { path: '**', redirectTo: '' }
];