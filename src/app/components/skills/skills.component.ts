import { Component, OnInit } from '@angular/core';
import { Skill } from '../../models/skill.model';
import { SkillService } from '../../services/skill.service';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-skills',
  imports: [NgFor, RouterLink],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit {
  skills: Skill[] = [];

  constructor(private skillService: SkillService) {}   

  ngOnInit(): void {
    this.loadskills();
  }

  async loadskills(): Promise<void> {
    try {
      const response = await this.skillService.getSkills();
      if (response.status === 200 && Array.isArray(response.body)) {
        this.skills =
          response.body.map((product) => ({
            Id: product.Id,
            Title: product.Title,
            Items: product.Items,
          })) || [];
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  }
}
