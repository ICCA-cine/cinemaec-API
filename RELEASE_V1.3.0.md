# Release V1.3.0 - Production Stable

## Overview

**Release Date:** February 3, 2026  
**Status:** ✅ Stable - Deployed to Production (Cloud Run)  
**Commit SHA:**
- **Backend:** `8be5fc9` (cinemaec-API)
- **Frontend:** `7f2c8c5` (app-cinemaec-web)

## Backend Changes (v1.3.0)

### Major Fixes
- ✅ Fixed Cloud Run startup probe timeout (TCP connection failures)
- ✅ Consolidated 41 movies migrations into single baseline migration
- ✅ Made all migrations idempotent (IF EXISTS clauses)
- ✅ Configured async migrations in production to prevent startup blocking

### Key Files Modified
```
Dockerfile                              - Removed HEALTHCHECK
cloud-run.yaml                         - 10-minute startup probe configuration
cloudbuild.yaml                        - Fixed Cloud Run deployment
src/main.ts                            - Async migrations in production
src/migrations/1769900000000-*         - Baseline movies schema (398 lines)
docs/CLOUD_RUN_CONFIG.md               - Cloud Run configuration guide
docs/MIGRATION_CLEANUP.md              - Migration cleanup documentation
```

### Migration Status
**Active Migrations:** 18
- 17 base system migrations (users, assets, spaces, geographic data)
- 1 baseline movies migration

**Archived Migrations:** 41
- Location: `src/migrations-archived/movies-old/`
- Reason: Consolidated into baseline to prevent execution ordering issues

### Database Schema
**Movies Module - 14 New Tables:**
- movies
- subgenres, cinematic_roles
- movies_languages, movies_cities, movies_provinces
- movies_subgenres, movies_frame_assets
- movie_professionals, movie_companies, movie_platforms
- movie_contacts, movie_content_bank, movie_funding
- movie_festival_nominations, movie_national_releases
- movie_international_releases

**Total Enums:** 12
- movies_type_enum
- movies_genre_enum
- movies_classification_enum
- movies_projectStatus_enum
- movies_status_enum
- movie_contacts_cargo_enum
- movie_companies_participation_enum
- movie_funding_fundingStage_enum
- movie_festival_nominations_result_enum
- movie_national_releases_type_enum
- movie_international_releases_type_enum
- movie_content_bank_exhibitionWindow_enum

### Environment Variables
```
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://app.cinemaec.com,http://localhost:3000
DATABASE_URL=postgresql://...
```

## Frontend Changes (v1.3.0)

### New Features
- ✅ Admin Movies Management Dashboard (Phase 3)
- ✅ User profile detail page with admin actions
- ✅ Space enums alignment with backend
- ✅ Improved home layout and CTAs
- ✅ Reusable Loader component

### Commits
```
7f2c8c5 - feat: Add Admin Movies Management Dashboard - Phase 3
5ebbab0 - feat: Add user profile detail page with admin actions
9255b47 - feat: align Space enums with backend and improve home layout
d766b73 - feat: improve home panels CTA and footer
fbb5efc - refactor: extract Loader into reusable component
```

## Deployment Checklist

### Backend (Cloud Run)
- ✅ Docker image built and pushed to us-central1-docker.pkg.dev
- ✅ Cloud Run service updated with new configuration
- ✅ Startup probe: TCP on port 8080 (10 min timeout)
- ✅ Migrations: Async execution (no startup blocking)
- ✅ Database: PostgreSQL Cloud SQL connected
- ✅ Health endpoint: /health (ready immediately)

### Frontend
- ✅ Built and deployed to Vercel/hosting
- ✅ Environment variables configured
- ✅ API integration tested

## Testing Completed

✅ **Backend:**
- Database migrations execute without errors
- Startup probe passes immediately
- Health endpoint responds correctly
- Async migrations run in background
- Movies schema created with all tables and FKs

✅ **Frontend:**
- Admin dashboard loads correctly
- API integration works
- CORS properly configured
- User authentication flows

## Known Issues

None reported. System is stable in production.

## How to Deploy Updates

### If working on dev branch:
```bash
# Backend
cd cinemaec-backend
git checkout dev
git pull origin dev
npm install
npm run build
git commit -am "your changes"
git push origin dev

# Create PR: dev → main
# After merge and deployment, merge main → dev for next cycle
```

### If deploying hotfix to production:
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/issue-description
# ... make changes
git commit -am "fix: description"
git push origin hotfix/issue-description

# Create PR: hotfix → main
# After merge: main is auto-deployed by Cloud Build
# Then merge main → dev
```

## Versioning Scheme

**Format:** MAJOR.MINOR.PATCH (V1.3.0)
- **MAJOR:** Breaking changes / new major features
- **MINOR:** New features, significant improvements
- **PATCH:** Bug fixes, minor updates

**Current:**
- V1.3.0 - Latest production stable
- V1.2.x - Previous releases (archived)

## Next Steps

1. ✅ Merge main → dev (both repos) - COMPLETED
2. Continue feature development on dev branch
3. Create PRs for code review before main merge
4. Tags auto-track production version

## Contact & Support

- **Backend Issues:** cinemaec-API repo
- **Frontend Issues:** app-cinemaec-web repo
- **Deployment Issues:** Check Cloud Run logs
  ```bash
  gcloud run services logs read api-cinemaec --region=us-central1 --limit=100
  ```

---

**Version:** V1.3.0  
**Last Updated:** 2026-02-03  
**Status:** ✅ PRODUCTION STABLE
