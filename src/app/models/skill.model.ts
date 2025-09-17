export interface Skill {
  ID: number;
  Title: string;
  Items: string[];
}

export const SKILLS: Skill[] = [
  {
    ID: 1,
    Title: 'UI Automation Test Frameworks',
    Items: [
      'Spec-flow/MsTest Framework with C# and Selenium Web-driver, Appium',
      'Cucumber test frameworks with Typescript/JavaScript and WebdriverIO',
      'Cucumber framework with Java + Selenium webdriver',
      'Playwright with Typescript/JavaScript',
      'Cypress with TypeScript',
    ],
  },
  {
    ID: 2,
    Title: 'API Automation Test Framework',
    Items: [
      'Spec-flow/MsTest Framework with C# and RestSharp',
      'Postman Collections with Newman',
    ],
  },
  {
    ID: 3,
    Title: 'Languages',
    Items: ['C#, Typescript/JavaScript, Python, Java, SQL'],
  },
  {
    ID: 4,
    Title: 'Testing and Version control tools',
    Items: ['Azure DevOps, JIRA, Github and TFS'],
  },
  {
    ID: 5,
    Title: 'Cloud Services',
    Items: [
      'Browserstack, LambdaTest, Sauce Labs',
      'AWS (Lambda, EC2, SQS), Azure Pipeline, CircleCI',
    ],
  },
  {
    ID: 6,
    Title: 'Databases',
    Items: ['SQL Server, DynamoDb, MangoDb, Oracle'],
  },
];
