# CMS Web Sample

Angular 13 CMS web application sample — derived from an internal enterprise CMS project.

## Project Structure

```
src/
├── app/
│   ├── _directives/       # Custom directives (drag & drop)
│   ├── _helpers/           # HTTP interceptors (JWT refresh)
│   ├── _models/constants/  # App constants (menu, theme, particles)
│   ├── _pipe/              # Custom pipes (link, safe)
│   ├── _services/
│   │   ├── auth/           # Auth guard, auth service, crypto
│   │   └── data/           # API services (chat, checkin, profile, etc.)
│   ├── modules/
│   │   ├── admin/          # Lazy-loaded admin module with dashboard
│   │   ├── guest/          # Lazy-loaded guest/login module
│   │   └── health/         # Health check endpoint
│   └── shared/             # Shared components, modules
├── environments/           # Environment configs
└── assets/                 # (excluded — plugins, images, sounds)
```

## Key Patterns

- **JWT token refresh** via HTTP interceptor with `BehaviorSubject` queue
- **Environment detection** by hostname (local/dev/staging/prod)
- **Role-based menu** with recursive permission checking
- **Lazy-loaded feature modules** (admin, guest)
- **Shared module** exporting common components and Angular Material
- **Drag & drop directive** with file handling
- **AES encryption** service for sensitive data
- **Activity logging** across all API services

## Getting Started

```bash
npm install
ng serve
```

## Notes

- All credentials, API keys, tokens, and internal URLs have been replaced with placeholders.
- Large asset folders (plugins, images, sounds) have been excluded.
- Only representative data services are included; the original had many more feature-specific services.
