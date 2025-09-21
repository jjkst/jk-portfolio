export interface Project {
  ID: number;
  Title: string;
  Subtitle?: string;
  Type: string;
  Roles?: string;
  TechStack?: string;
  Description?: string;
  Features?: { title: string; Description: string }[];
  FileName: string;
  ProjectUrl?: string;
}

export const PRODUCTS: Project[] = [
  {
    ID: 1,
    Title: 'Playwright, Typescript and Cucumber framework',
    Subtitle: 'End to End UI Automation Test Suite',
    Type: 'Test Automation',
    Roles: 'Staff/Senior Quality Assurance Enginner, SDET',
    TechStack: 'Playwright, Typescript, Cucumber, BDD',
    Description:
      'This project is a comprehensive UI automation test suite designed to validate key user flows and functionalities of a web application. Using the Behavior-Driven Development (BDD) approach, the tests are written in a human-readable format, making them easy for both technical and non-technical stakeholders to understand.',
      Features: [
      {
        title: 'Project Structure and Design Patterns',
        Description: `<b>Page Object Model (POM)</b>:<br>This is a key design pattern used. It separates the test code from the page-specific locators (elements like buttons, text fields) and actions. This makes tests more readable and easier to maintain. For example, if a button's ID changes, you only need to update it in one place (the page object), not in every test file that uses it. <br>
        <b>Directory Structure</b>:<br>
          Features/: Contains the test cases.<br>
          PageObjects/: Contains the Page Object classes for each page of the application.<br>
          Steps/: Contains the steps mapping to the test cases.<br>
          Support/: Helper methods and reusable components.`,
      },
      {
        title: 'Test Scenarios & Scope',
        Description: `<b>Login and Logout</b>: This fundamental scenario verifies that users can successfully log into the application with valid credentials and then securely log out. This validates the security and state management of the application.<br>
        <b>Check All Products Exist</b>: This test is crucial for data validation. It verifies that a predefined list of products is correctly displayed on the page. This prevents issues where products might be missing or incorrectly labeled.<br>
        <b>Buy Products</b>: A complete end-to-end purchasing journey. <br> <b>Remove Products</b>: This scenario tests the user's ability to manage their cart.`,
      },
      {
        title: 'Execution and Reporting',
        Description: `Tests can be run locally via Visual Studio.<br>
          For CI/CD integration, tools like Jenkins or Azure DevOps can be configured to
          trigger test runs on code commits or pull requests. Test results are
          compiled into detailed reports using Reqnroll, providing insights into
          test outcomes, execution times, and any failures.`,
      },
    ],
    FileName: 'TypescriptPlaywrightCucumber.png',
    ProjectUrl: 'https://example.com/project1',
  },
  {
    ID: 2,
    Title: 'Cypress and Typescript framework',
    Subtitle: 'End to End UI Automation Test Suite',
    Type: 'Test Automation',
    Roles: 'Staff/Senior Quality Assurance Enginner, SDET',
    TechStack: 'Cypress, Typescript, Cucumber, BDD',
    Description:
      'This project is a comprehensive UI automation test suite designed to validate key user flows and functionalities of a web application. Using the Behavior-Driven Development (BDD) approach, the tests are written in a human-readable format, making them easy for both technical and non-technical stakeholders to understand.',
    Features: [
      {
        title: 'Project Structure and Design Patterns',
        Description: `<b>Page Object Model (POM)</b>:<br>This is a key design pattern used. It separates the test code from the page-specific locators (elements like buttons, text fields) and actions. This makes tests more readable and easier to maintain. For example, if a button's ID changes, you only need to update it in one place (the page object), not in every test file that uses it. <br>
        <b>Directory Structure</b>:<br>
          Features/: Contains the test cases.<br>
          PageObjects/: Contains the Page Object classes for each page of the application.<br>
          Steps/: Contains the steps mapping to the test cases.<br>
          Support/: Helper methods and reusable components.`,
      },
      {
        title: 'Test Scenarios & Scope',
        Description: `<b>Login and Logout</b>: This fundamental scenario verifies that users can successfully log into the application with valid credentials and then securely log out. This validates the security and state management of the application.<br>
        <b>Check All Products Exist</b>: This test is crucial for data validation. It verifies that a predefined list of products is correctly displayed on the page. This prevents issues where products might be missing or incorrectly labeled.<br>
        <b>Buy Products</b>: A complete end-to-end purchasing journey. <br> <b>Remove Products</b>: This scenario tests the user's ability to manage their cart.`,
      },
      {
        title: 'Execution and Reporting',
        Description: `Tests can be run locally via Visual Studio.<br>
          For CI/CD integration, tools like Jenkins or Azure DevOps can be configured to
          trigger test runs on code commits or pull requests. Test results are
          compiled into detailed reports using Reqnroll, providing insights into
          test outcomes, execution times, and any failures.`,
      },
    ],
    FileName: 'CypressTypescript.png',
    ProjectUrl: 'https://example.com/project1',
  },
  {
    ID: 3,
    Title: 'RestSharp, C# and Reqroll framework',
    Subtitle: 'API Integration Automation Test Suite',
    Type: 'Test Automation',
    Roles: 'Staff/Senior Quality Assurance Enginner, SDET',
    TechStack: 'RestSharp, C#, Reqnroll, BDD',
    Description:
      'APi testing project using RestSharp and Reqnroll framework. The test suite is designed to validate the functionality, reliability, and performance of RESTful APIs. It covers a range of scenarios including CRUD operations, authentication, error handling, and data validation.',
    Features: [
      {
        title: 'Project Structure and Design Patterns',
        Description: `<b>Page Object Model (POM)</b>:<br>This is a key design pattern used. It separates the test code from the page-specific locators (elements like buttons, text fields) and actions. This makes tests more readable and easier to maintain. For example, if a button's ID changes, you only need to update it in one place (the page object), not in every test file that uses it. <br>
        <b>Directory Structure</b>:<br>
          Features/: Contains the test cases.<br>
          PageObjects/: Contains the Page Object classes for each page of the application.<br>
          Steps/: Contains the steps mapping to the test cases.<br>
          Support/: Helper methods and reusable components.`,
      },
      {
        title: 'Test Scenarios & Scope',
        Description: `<b>Login and Logout</b>: This fundamental scenario verifies that users can successfully log into the application with valid credentials and then securely log out. This validates the security and state management of the application.<br>
        <b>Check All Products Exist</b>: This test is crucial for data validation. It verifies that a predefined list of products is correctly displayed on the page. This prevents issues where products might be missing or incorrectly labeled.<br>
        <b>Buy Products</b>: A complete end-to-end purchasing journey. <br> <b>Remove Products</b>: This scenario tests the user's ability to manage their cart.`,
      },
      {
        title: 'Execution and Reporting',
        Description: `Tests can be run locally via Visual Studio.<br>
          For CI/CD integration, tools like Jenkins or Azure DevOps can be configured to
          trigger test runs on code commits or pull requests. Test results are
          compiled into detailed reports using Reqnroll, providing insights into
          test outcomes, execution times, and any failures.`,
      },
    ],
    FileName: 'RestSharpCSharpReqnRoll.png',
    ProjectUrl: 'https://example.com/project2',
  },
  {
    ID: 4,
    Title: 'Selenium, C# and Reqroll framework',
    Subtitle: 'End to End UI Automation Test Suite',
    Type: 'Test Automation',
    Roles: 'Staff/Senior Quality Assurance Enginner, SDET',
    TechStack: 'Selenium, C#, Reqnroll, BDD',
    Description:
      'This project is a comprehensive UI automation test suite designed to validate key user flows and functionalities of a web application. Using the Behavior-Driven Development (BDD) approach, the tests are written in a human-readable format, making them easy for both technical and non-technical stakeholders to understand.',
    Features: [
      {
        title: 'Project Structure and Design Patterns',
        Description: `<b>Page Object Model (POM)</b>:<br>This is a key design pattern used. It separates the test code from the page-specific locators (elements like buttons, text fields) and actions. This makes tests more readable and easier to maintain. For example, if a button's ID changes, you only need to update it in one place (the page object), not in every test file that uses it. <br>
        <b>Directory Structure</b>:<br>
          Features/: Contains the test cases.<br>
          PageObjects/: Contains the Page Object classes for each page of the application.<br>
          Steps/: Contains the steps mapping to the test cases.<br>
          Support/: Helper methods and reusable components.`,
      },
      {
        title: 'Test Scenarios & Scope',
        Description: `<b>Login and Logout</b>: This fundamental scenario verifies that users can successfully log into the application with valid credentials and then securely log out. This validates the security and state management of the application.<br>
        <b>Check All Products Exist</b>: This test is crucial for data validation. It verifies that a predefined list of products is correctly displayed on the page. This prevents issues where products might be missing or incorrectly labeled.<br>
        <b>Buy Products</b>: A complete end-to-end purchasing journey. <br> <b>Remove Products</b>: This scenario tests the user's ability to manage their cart.`,
      },
      {
        title: 'Execution and Reporting',
        Description: `Tests can be run locally via Visual Studio.<br>
          For CI/CD integration, tools like Jenkins or Azure DevOps can be configured to
          trigger test runs on code commits or pull requests. Test results are
          compiled into detailed reports using Reqnroll, providing insights into
          test outcomes, execution times, and any failures.`,
      },
    ],
    FileName: 'CSharpSeleniumReqnroll.png',
    ProjectUrl: 'https://example.com/project1',
  },
  {
    ID: 5,
    Title: 'Playwright, C# and Reqroll framework',
    Subtitle: 'End to End UI Automation Test Suite',
    Type: 'Test Automation',
    Roles: 'Staff/Senior Quality Assurance Enginner, SDET',
    TechStack: 'Playwright, C#, Reqnroll, BDD, ExtentReports, NLog',
    Description:
      'This project is a comprehensive UI automation test suite designed to validate key user flows and functionalities of a web application. Using the Behavior-Driven Development (BDD) approach, the tests are written in a human-readable format, making them easy for both technical and non-technical stakeholders to understand.',
    Features: [
      {
        title: 'Project Structure and Design Patterns',
        Description: `<b>Page Object Model (POM)</b>:<br>This is a key design pattern used. It separates the test code from the page-specific locators (elements like buttons, text fields) and actions. This makes tests more readable and easier to maintain. For example, if a button's ID changes, you only need to update it in one place (the page object), not in every test file that uses it. <br>
        <b>Directory Structure</b>:<br>
          Features/: Contains the test cases.<br>
          PageObjects/: Contains the Page Object classes for each page of the application.<br>
          Steps/: Contains the steps mapping to the test cases.<br>
          Support/: Helper methods and reusable components.`,
      },
      {
        title: 'Test Scenarios & Scope',
        Description: `<b>Login and Logout</b>: This fundamental scenario verifies that users can successfully log into the application with valid credentials and then securely log out. This validates the security and state management of the application.<br>
        <b>Check All Products Exist</b>: This test is crucial for data validation. It verifies that a predefined list of products is correctly displayed on the page. This prevents issues where products might be missing or incorrectly labeled.<br>
        <b>Buy Products</b>: A complete end-to-end purchasing journey. <br> <b>Remove Products</b>: This scenario tests the user's ability to manage their cart.`,
      },
      {
        title: 'Execution and Reporting',
        Description: `Tests can be run locally via Visual Studio.<br>
          For CI/CD integration, tools like Jenkins or Azure DevOps can be configured to
          trigger test runs on code commits or pull requests. Test results are
          compiled into detailed reports using Reqnroll, providing insights into
          test outcomes, execution times, and any failures.`,
      },
    ],
    FileName: 'PlaywrightReqnRollCSharp.png',
    ProjectUrl: 'https://github.com/jjkst/PlaywrightReqnRollCSharp',
  },
  {
    ID: 6,
    Title: 'Web Application - Angular and Typescript',
    Subtitle: 'Service, Schedule and Appointment Management',
    Type: 'Development',
    Roles: 'Web Developer',
    TechStack: 'Angular, Typescript, Node.js',
    Description: `This project is a comprehensive management platform designed to
        streamline the core operations of a service-based business. It provides
        a robust system for managing services, defining staff availability, and
        handling customer appointments. The application is built using Angular for the frontend,
        ensuring a dynamic and responsive user experience, while Node.js powers the backend,
        providing a scalable and efficient server-side solution`,
    Features: [
      {
        title: 'Service Management',
        Description: `Businesses can meticulously detail their offerings using the Service
          model, including titles, descriptions, and tiered pricing plans. This
          serves as the foundation of the platform, organizing and presenting
          all available options to customers.`,
      },
      {
        title: 'Availability Management',
        Description: `The Availability model allows businesses to define when their services are open to the public. This feature enables staff to set their working hours, specific dates, and available time slots for particular services, ensuring that the booking system accurately reflects real-time capacity.`,
      },
      {
        title: 'Schedule Management',
        Description: `The Schedule model facilitates the final booking process. Customers can select a service, choose from the available time slots, and provide their contact information. This creates a detailed record of each appointment, including the selected date, time, and services. The system can then use this data to send confirmations and reminders, ensuring a smooth and organized workflow for both the business and its clients.`,
      },
    ],
    FileName: 'FrontendDev.png',
    ProjectUrl: 'https://example.com/project3',
  },
  {
    ID: 7,
    Title: 'Api Development - .Net, Entity Framework and MySql',
    Subtitle: 'Api services for Service, Schedule and Appointment Management',
    Type: 'Development',
    Roles: 'Api Developer',
    TechStack: '.Net, Entity Framework, MySql',
    Description: `This project is a comprehensive management platform designed to
        streamline the core operations of a service-based business. It provides
        a robust system for managing services, defining staff availability, and
        handling customer appointments. The application is built using .Net for the backend,
        ensuring a dynamic and responsive user experience, while MySql powers the database,
        providing a scalable and efficient data storage solution`, 
    Features: [
      {
        title: 'Service Management',
        Description: `Businesses can meticulously detail their offerings using the Service
          model, including titles, descriptions, and tiered pricing plans. This
          serves as the foundation of the platform, organizing and presenting
          all available options to customers.`,
      },
      {
        title: 'Availability Management',
        Description: `The Availability model allows businesses to define when their services are open to the public. This feature enables staff to set their working hours, specific dates, and available time slots for particular services, ensuring that the booking system accurately reflects real-time capacity.`,
      },
      {
        title: 'Schedule Management',
        Description: `The Schedule model facilitates the final booking process. Customers can select a service, choose from the available time slots, and provide their contact information. This creates a detailed record of each appointment, including the selected date, time, and services. The system can then use this data to send confirmations and reminders, ensuring a smooth and organized workflow for both the business and its clients.`,
      },
    ],
    FileName: 'BackendDev.png',
    ProjectUrl: 'https://example.com/project3',
  },
];
