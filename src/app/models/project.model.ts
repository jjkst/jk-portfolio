export interface Project {
  Id: number;
  Title: string;
  Subtitle?: string;
  Type: string;
  TechStack?: string;
  FileName: string;
  Github?: string;
  Webpage?: string;
  readmeExcludeSections?: string[];
}
