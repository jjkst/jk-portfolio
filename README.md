# JK Portfolio

Professional portfolio and service management application built with Angular 19.

## Features

- **Portfolio Showcase** - Hero section, skills display, project cards with detail pages and image carousels
- **About Page** - Profile bio, description list, skills summary, and downloadable resume
- **Contact Form** - Reactive form with validation, connected to email API
- **Service Management** - CRUD for services, availability, and schedules (via ruku-bookings library)
- **Role-Based Actions** - Edit/delete buttons visible in dev mode; requires auth token in production
- **SSR + Hydration** - Server-side rendering with Express and Angular SSR for SEO and fast first paint
- **Responsive Design** - Desktop navbar with active states, mobile hamburger menu

## Architecture

```
jk-portfolio/
├── src/
│   └── app/
│       ├── pages/                        # Route-level components
│       │   ├── home/                     #   Landing page (hero, skills, projects)
│       │   ├── about/                    #   Profile, bio, resume download
│       │   ├── contact/                  #   Contact form
│       │   ├── projects-page/            #   Project card grid
│       │   └── project-detail/           #   Single project with carousel
│       ├── components/                   # Reusable UI components
│       │   ├── header/                   #   Navbar (desktop + mobile)
│       │   ├── footer/                   #   Site footer
│       │   ├── hero/                     #   Hero banner
│       │   ├── skills/                   #   Skills grid
│       │   ├── projects/                 #   Project card list
│       │   └── image-carousel/           #   Image slideshow
│       ├── services/                     # Portfolio-specific services
│       │   ├── base.service.ts           #   Abstract base (GET/POST/PUT/DELETE)
│       │   ├── email.service.ts          #   Contact email API
│       │   ├── profile.service.ts        #   Static profile data
│       │   ├── project.service.ts        #   Static project data
│       │   ├── skill.service.ts          #   Static skill data
│       │   └── file-download.service.ts  #   Blob file download
│       ├── models/                       # Portfolio-specific models
│       │   ├── contact.model.ts
│       │   ├── profile.modal.ts
│       │   ├── project.modal.ts
│       │   └── skill.model.ts
│       └── base.component.ts             # Abstract base (toasts, cleanup, canManage)
├── lib/
│   └── ruku-bookings/                    # Symlink -> ruku-features/dist/ruku-bookings
├── environment.ts                        # Dev config (apiBaseUrl, OAuth keys)
└── e2e/                                  # Playwright E2E tests
```

## ruku-bookings Library

Booking/scheduling components and services are consumed from the `ruku-bookings` library (built in the `ruku-features` workspace). This project does NOT duplicate booking code locally.

**Imported from ruku-bookings:**
- **Components**: HeaderComponent (configurable nav), FooterComponent, HorizontalCardListComponent, ServiceManager, AvailabilityManager, ScheduleManager
- **Pages**: LoginComponent, FeatureComponent
- **Services**: AuthService, ProductService, AvailabilityService, ScheduleService, ImageUploadService, authInterceptor
- **Other**: authGuard, MaterialModule, models (Availability, Service, Schedule)

**Kept local** (portfolio-specific):
- BaseService, BaseComponent (generic utilities, use `environment` directly)
- All portfolio pages, components, services, and models

## Routes

| Path | Component | Source |
|---|---|---|
| `/` | HomeComponent | local |
| `/projects` | ProjectsPageComponent | local |
| `/project/:id` | ProjectDetailComponent | local |
| `/about` | AboutComponent | local |
| `/contact` | ContactComponent | local |
| `/login` | LoginComponent | ruku-bookings |
| `/features` | FeatureComponent | ruku-bookings |
| `/features/service-manager` | ServiceManagerComponent | ruku-bookings |
| `/features/availability-manager` | AvailabilityManagerComponent | ruku-bookings |
| `/features/schedule-manager` | ScheduleManagerComponent | ruku-bookings |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19.2 |
| UI Library | Angular Material 19.2 (azure-blue theme) |
| Styling | SCSS |
| Icons | Font Awesome 7.0 |
| SSR | Express + @angular/ssr with hydration |
| Unit Tests | Karma + Jasmine |
| E2E Tests | Playwright + Chromium |
| Deployment | Docker (multi-stage) + Nginx |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- `ruku-bookings` library built (from `ruku-features` workspace)

### Setup

```bash
# 1. Build the library first (in ruku-features workspace)
cd ../ruku-features
npm run build

# 2. Install dependencies (resolves lib/ruku-bookings symlink)
cd ../jk-portfolio
npm install --legacy-peer-deps

# 3. Start development server
npm start
```

Navigate to `http://localhost:4200/`.

### Updating ruku-bookings Library Changes

After making changes to the `ruku-bookings` library in the `ruku-features` workspace:

```bash
# 1. Rebuild the library
cd ../ruku-features
ng build ruku-bookings

# 2. In jk-portfolio, clear Angular cache and restart
cd ../jk-portfolio
Remove-Item -Recurse -Force .angular\cache   # PowerShell
# or: rm -rf .angular/cache                  # Bash/Git Bash
npm start
```

The dev server caches the library, so clearing `.angular/cache` is required to pick up changes.

### Connected Backend

The management features (services, availability, schedules) connect to **RukuServiceApi** at `http://localhost:5002/api`. JWT authentication is handled via `authInterceptor` from ruku-bookings.

Static pages (Home, About, Projects, Contact) work without the backend.

## Testing

```bash
# Unit tests (watch mode)
npm test

# Unit tests (CI)
npm test -- --watch=false --browsers=ChromeHeadless

# E2E tests
npm run e2e

# E2E with visible browser
npm run e2e:headed
```

## Docker

### Standalone (requires pre-built ruku-bookings in lib/)

```bash
docker build -t jk-portfolio .
docker run -p 80:80 jk-portfolio
```

> **Note:** The standalone Dockerfile requires the `ruku-bookings` library to be pre-built in `lib/ruku-bookings/`. The symlink to `../ruku-features/dist/ruku-bookings` does not resolve inside Docker's build context.

### Full-Stack Deployment

For deploying the complete stack (frontend + API + database + SSL), see the **[jk-portfolio-deploy](https://github.com/jjkst/jk-portfolio-deploy)** project.

The deploy project includes a multi-stage Dockerfile that builds the `ruku-bookings` library from source, then builds this app — no symlinks or pre-built artifacts needed.
