# JK Portfolio

Professional portfolio and service management application built with Angular 19.

## Features

- **Portfolio Showcase** - Hero section, skills display, project cards with detail pages and image carousels
- **About Page** - Profile bio, description list, skills summary, and downloadable resume
- **Contact Form** - Reactive form with validation, connected to email API
- **Service Manager** - CRUD for products/services with image upload, features list, and pricing plans
- **Availability Manager** - CRUD for date ranges, timeslots, and service availability windows
- **Schedule Manager** - CRUD for appointments with cascading date > service > timeslot selection
- **Role-Based Actions** - Edit/delete buttons visible in dev mode; requires auth token in production
- **SSR + Hydration** - Server-side rendering with Express and Angular SSR for SEO and fast first paint
- **Responsive Design** - Desktop navbar with active states, mobile hamburger menu

## Architecture

```
src/
  app/
    pages/                          # Route-level components
      home/                         #   Landing page (hero, skills, projects)
      about/                        #   Profile, bio, resume download
      contact/                      #   Contact form
      projects-page/                #   Project card grid
      project-detail/               #   Single project with carousel
      feature/                      #   Tabbed management (child routes)
    components/                     # Reusable UI components
      header/                       #   Navbar (desktop + mobile)
      footer/                       #   Site footer
      hero/                         #   Hero banner
      skills/                       #   Skills grid
      projects/                     #   Project card list
      image-carousel/               #   Image slideshow
      horizontal-card-list/         #   Paginated card list with edit/delete
      service-manager/              #   Service CRUD form
      availability-manager/         #   Availability CRUD form
      schedule-manager/             #   Schedule CRUD form
    services/                       # HTTP services
      base.service.ts               #   Abstract base (GET/POST/PUT/DELETE, error handling)
      product.service.ts            #   Services/products API
      availability.service.ts       #   Availability API (dates, timeslots, services)
      schedule.service.ts           #   Schedule API
      email.service.ts              #   Contact email API
      profile.service.ts            #   Static profile data
      project.service.ts            #   Static project data
      skill.service.ts              #   Static skill data
      file-download.service.ts      #   Blob file download
      imageupload.service.ts        #   Image upload API
      auth.interceptor.ts           #   JWT token attachment
    models/                         # TypeScript interfaces
  assets/                           # Images and static files
  environment.ts                    # Dev config (apiBaseUrl, production flag)
  environments/
    environment.prod.ts             # Prod config
e2e/
  playwright.config.ts              # Playwright configuration
  src/                              # E2E test specs
```

### Key Patterns

- **Standalone components** - No NgModules; all components use `standalone: true`
- **BaseComponent** - Abstract class providing `destroy$` (RxJS cleanup), `snackBar`, `loading`, and `canManage` (role-based visibility)
- **BaseService** - Abstract class with typed HTTP methods, error handling, and field validation
- **Reactive Forms** - `FormBuilder` + `Validators` with `takeUntil(destroy$)` cleanup
- **OnPush** change detection where possible

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | HomeComponent | Landing page with hero, skills, and projects |
| `/projects` | ProjectsPageComponent | Grid of all project cards |
| `/project/:id` | ProjectDetailComponent | Individual project details with carousel |
| `/about` | AboutComponent | Profile bio, skills, and resume download |
| `/contact` | ContactComponent | Contact form with validation |
| `/features` | FeatureComponent | Tabbed management area (child routes below) |
| `/features/service-manager` | ServiceManagerComponent | Service CRUD |
| `/features/availability-manager` | AvailabilityManagerComponent | Availability CRUD |
| `/features/schedule-manager` | ScheduleManagerComponent | Schedule CRUD |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2 |
| UI Library | Angular Material 19.2 (azure-blue theme) |
| Styling | SCSS (violet accents, white cards, box-shadow depth) |
| Icons | Font Awesome 7.0 |
| SSR | Express + @angular/ssr with hydration |
| Unit Tests | Karma + Jasmine (65 tests) |
| E2E Tests | Playwright + Chromium (79 tests) |
| Deployment | Docker (multi-stage) + Nginx |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Chrome (for unit tests)

### Install and Run

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install chromium

# Start development server
npm start
```

Navigate to `http://localhost:4200/`. The app auto-reloads on file changes.

### Connected Backend

The management features (services, availability, schedules) connect to **RukuServiceApi** at `http://localhost:5002/api`. JWT authentication is handled via `authInterceptor`.

Static pages (Home, About, Projects, Contact) work without the backend.

## Testing

### Unit Tests (Karma + Jasmine)

65 tests covering all HTTP services and the auth interceptor.

```bash
# Watch mode
npm test

# Single run (CI)
npm test -- --watch=false --browsers=ChromeHeadless
```

| File | Tests | Coverage |
|---|---|---|
| `base.service.spec.ts` | 10 | GET/POST/PUT/DELETE, error handling, validation |
| `auth.interceptor.spec.ts` | 4 | Token attachment, non-API passthrough |
| `availability.service.spec.ts` | 9 | CRUD, timeslot queries, field validation |
| `email.service.spec.ts` | 4 | Send email, contact validation |
| `file-download.service.spec.ts` | 2 | Blob download |
| `product.service.spec.ts` | 10 | CRUD, ruku services, field validation |
| `profile.service.spec.ts` | 3 | Static profile data |
| `schedule.service.spec.ts` | 7 | CRUD, field validation |
| `skill.service.spec.ts` | 3 | Static skill data |
| `project.service.spec.ts` | 4 | Get projects, get by ID |
| `imageupload.service.spec.ts` | 3 | Single and multiple image uploads |

### E2E Tests (Playwright)

79 tests covering all pages, navigation, forms, and CRUD workflows. API calls are mocked at the browser level using `page.route()` so no backend is needed.

```bash
# Run all E2E tests (headless, auto-starts dev server)
npm run e2e

# Run with visible browser
npm run e2e:headed

# Interactive UI mode
npm run e2e:ui

# Run a specific test file
npx playwright test --config=e2e/playwright.config.ts e2e/src/home.spec.ts
```

| File | Tests | Coverage |
|---|---|---|
| `navigation.spec.ts` | 10 | Desktop nav, mobile hamburger menu, active states, routing |
| `home.spec.ts` | 6 | Hero section, CTA, skills, projects, header/footer |
| `about.spec.ts` | 8 | Profile heading, image, bio, skills, summary, resume download |
| `projects.spec.ts` | 4 | Project grid, cards, navigation to detail |
| `project-detail.spec.ts` | 10 | Title, tech stack, overview, features, carousel, GitHub link |
| `contact.spec.ts` | 6 | Form fields, validation, submit states |
| `feature.spec.ts` | 5 | Tab navigation, active tab, routed content |
| `service-manager.spec.ts` | 10 | Service CRUD: add, edit, update, delete, form validation |
| `availability-manager.spec.ts` | 10 | Availability CRUD: add, edit, update, delete, form validation |
| `schedule-manager.spec.ts` | 10 | Schedule CRUD: add, edit, update, delete, cascading fields |

### Playwright Configuration

- **Parallel by file**: Spec files run across 3 workers in parallel
- **Sequential within file**: Tests in each file run sequentially (`fullyParallel: false`)
- **CI mode**: 1 worker, 2 retries
- **Auto server**: Dev server starts automatically if not already running

## Docker

### Build and Run

```bash
# Build the image
docker build -t jk-portfolio .

# Run the container
docker run -p 80:80 jk-portfolio
```

Navigate to `http://localhost`.

### How It Works

The Dockerfile uses a **multi-stage build**:

1. **Build stage** (Node.js 20 Alpine) - Installs dependencies, runs `ng build --configuration production`
2. **Serve stage** (Nginx Alpine) - Copies the built static files from `dist/jk-portfolio/browser` and serves them on port 80

The Angular SSR build produces `index.csr.html`; the Dockerfile automatically renames it to `index.html` if needed for Nginx compatibility.

### Docker with Backend

To run alongside the backend API:

```bash
docker run -p 80:80 -e API_URL=http://your-api-host:5002/api jk-portfolio
```
