export interface Project {
  ID: number;
  Title: string;
  Subtitle?: string;
  Type: string;
  Roles?: string;
  Tools?: string;
  LiveLink?: string;
  Description: string;
  FileName: string;
  ProjectUrl: string;
}

export const PRODUCTS: Project[] = [
    {
    ID: 1,
    Title: 'Playwright, Typescript and Cucumber framework',
    Type: 'Test Automation',
    Description: 'Description for Project One',
    FileName: 'TypescriptPlaywrightCucumber.png',
    ProjectUrl: 'https://example.com/project1',
  },
  {
    ID: 2,
    Title: 'Cypress and Typescript framework',
    Type: 'Test Automation',
    Description: 'Description for Project One',
    FileName: 'CypressTypescript.png',
    ProjectUrl: 'https://example.com/project1',
  },
    {
    ID: 3,
    Title: 'RestSharp, C# and Reqroll framework',
    Type: 'Test Automation',
    Description: 'Description for Project Two',
    FileName: 'RestSharpCSharpReqnRoll.png',
    ProjectUrl: 'https://example.com/project2',
  },
  {
    ID: 4,
    Title: 'Selenium, C# and Reqroll framework',
    Type: 'Test Automation',
    Description: 'Description for Project One',
    FileName: 'CSharpSeleniumReqnroll.png',
    ProjectUrl: 'https://example.com/project1',
  },
    {
    ID: 5,
    Title: 'Playwright, C# and Reqroll framework',
    Type: 'Test Automation',
    Description: 'Description for Project One',
    FileName: 'CSharpPlaywrightReqnroll.png',
    ProjectUrl: 'https://example.com/project1',
  },
  {
    ID: 6,
    Title: 'Web Application - Angular and Typescript',
    Subtitle: 'Service, Schedule and Appointment Management',
    Type: 'Development',
    Roles: 'Web Developer',
    Tools: 'Angular, Node.js',
    LiveLink: 'https://example-angular-appointment-app.netlify.app/',
    Description: 'Description for Project Three',
    FileName: 'FrontendDev.png',
    ProjectUrl: 'https://example.com/project3',
  },
    {
    ID: 7,
    Title: 'Api Development - .Net, Entity Framework and MySql',
    Type: 'Development',
    Description: 'Description for Project Three',
    FileName: 'BackendDev.png',
    ProjectUrl: 'https://example.com/project3',
  },
];
