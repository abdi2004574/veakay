# Package & Itinerary Management

## Goal

Allow verified travel agencies to publish reusable trip packages (itineraries with visuals, pricing, and tags) that travelers can browse and attach to their own fundraising campaigns. Build the catalog/linking layer of Feature #9 (Agency Dashboard & Business Tools) so agencies have a real inventory surface and travelers have a real discovery path before Payments (#6) or booking flows exist.

## MVP Scope

- Agency package CRUD: create, edit, archive, and delete a package with title, description, base price, destination type, season, theme, and full itinerary text.
- Ordered visual assets per package via the existing presigned-upload / MediaAsset flow (`package_visual` MediaPurpose).
- Public package directory: travelers and agencies can browse active packages, filter by destination type / season / theme, cursor-paginated.
- Package detail: full itinerary text, visuals, and owner agency info (name, reputation).
- Many-to-many link/unlink between a traveler's campaign and any active package.
- Only `active` packages appear in public browse and are linkable; `inactive` and `archived` are owner-only.

## Later Scope

- Trip customization (per-campaign itinerary edits, price overrides, custom add-ons).
- Dynamic pricing formula (Open Question backlog — basePrice stored now, formula undefined).
- Agency package analytics (views, link-through rate, conversion to campaign).
- Package categories beyond the three tags (destination, season, theme).
- Bulk import/export for agency catalogs.
- Package reviews/ratings separate from agency reviews.

## Roles and Permissions

| Action | Allowed role | Condition |
|---|---|---|
| Create package | agency | Account must be `approved`; class-level `@RequireRole(UserRole.agency)` |
| Edit / archive / delete own package | agency | `Package.agencyId` must match the caller's agency record |
| Browse public packages | traveler, agency | Only `active` status; no role guard (any authenticated user) |
| View any package detail | traveler, agency | Active packages are public; inactive/archived return 404 to non-owners |
| Link package to campaign | traveler | Caller must own the target campaign; package must be `active` |
| Unlink package from campaign | traveler | Caller must own the target campaign |

## Main Flows

### Agency creates a package

```text
1. Agency calls POST /packages with title, description, basePrice, destinationType, season, theme, itinerary, and up to N media asset IDs (from prior presigned uploads).
2. Backend verifies the caller is an agency with an approved account.
3. Backend creates the Package row and ordered PackageMedia rows.
4. Backend returns the full package with presigned view URLs for each media asset.
```

### Traveler browses packages

```text
1. Traveler calls GET /packages?destinationType=beach&season=summer&theme=family.
2. Backend filters to status=active, applies optional tags, cursor-paginates.
3. Backend returns items with resolved media URLs and agency summary.
```

### Traveler links a package to their campaign

```text
1. Traveler calls POST /packages/:packageId/campaigns/:campaignId/link.
2. Backend verifies the package is active and the campaign is owned by the caller.
3. Backend creates a PackageCampaignLink row.
4. Duplicate links return 409.
```

## API Endpoints

### Agency CRUD (packages.controller.ts, @Controller('packages'))

| Method | Path | Auth | Summary |
|---|---|---|---|
| POST | /packages | @RequireRole(agency) | Create a package. |
| GET | /packages/mine | @RequireRole(agency) | List your agency's packages (all statuses). |
| GET | /packages/:id | @RequireRole(agency) | Get your own package detail (any status). |
| PATCH | /packages/:id | @RequireRole(agency) | Update your package. |
| DELETE | /packages/:id | @RequireRole(agency) | Delete your package. |

### Public Directory + Traveler Links (package-directory.controller.ts, @Controller('packages'))

| Method | Path | Auth | Summary |
|---|---|---|---|
| GET | /packages | Any authenticated user | Browse active packages, filter by destination/season/theme. |
| GET | /packages/:id | Any authenticated user | Get active package detail (404 for non-active). |
| POST | /packages/:packageId/campaigns/:campaignId/link | @RequireRole(traveler) | Link an active package to your campaign. |
| DELETE | /packages/:packageId/campaigns/:campaignId/link | @RequireRole(traveler) | Unlink a package from your campaign. |

## Database Models

### New models

```text
packages
  id                    UUID PK
  agency_id             UUID FK → agencies
  title                 VARCHAR
  description           TEXT nullable
  base_price            DECIMAL
  currency              VARCHAR default: 'USD'
  destination_type      ENUM: destination_types nullable
  season                VARCHAR nullable
  theme                 VARCHAR nullable
  itinerary             TEXT nullable
  status                ENUM: active | inactive | archived  default: active
  is_dynamic_pricing    BOOLEAN default: false
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

package_media
  id                    UUID PK
  package_id            UUID FK → packages
  media_id              UUID FK → media_assets
  display_order         INTEGER default: 0

package_campaign_links
  id                    UUID PK
  package_id            UUID FK → packages
  campaign_id           UUID FK → campaigns
  created_at            TIMESTAMP
  UNIQUE (package_id, campaign_id)
```

### Schema changes to existing models

- `MediaPurpose` enum: add `package_visual`.
- `Agency` model: add `packages Package[]` relation.
- `Campaign` model: add `packageLinks PackageCampaignLink[]` relation.
- `User` model: add `packages Package[]` relation.

### Media asset key structure

```
packages/{packageId}/visuals/{mediaId}.{ext}
```

## Edge Cases

- **Agency approval gate**: Only agencies with `status = approved` can create packages. Pending agencies receive `FORBIDDEN` on creation attempts.
- **Active-only linking**: Travelers can only link `active` packages. Archived/inactive packages return 404 on link attempts.
- **Campaign ownership**: Link/unlink endpoints verify the authenticated traveler is the `creatorId` of the target campaign.
- **Duplicate link prevention**: `PackageCampaignLink` has a unique `(packageId, campaignId)` constraint; duplicate link attempts return 409.
- **Soft-delete behavior**: Packages are hard-deleted (the TRD does not mention a soft-delete requirement for packages, unlike campaigns/posts/reviews). If moderation review becomes a requirement later, migrate to soft-delete.
- **Dynamic pricing stub**: `isDynamicPricing` is stored but never computed. The base price is the only price exposed to travelers. No formula is invented.
- **Media orphan cleanup**: If a package is deleted, its `PackageMedia` rows cascade-delete. The underlying `MediaAsset` objects are left for the existing storage cleanup job to reclaim if they remain in `pending` status > 24h.
- **Pagination defaults**: Public browse defaults to `limit=20`, max `50`. Agency list returns all packages (no pagination for agency-owned lists, matching the "small personal list" pattern from campaigns).

## Open Questions

| # | Question | Resolution for this feature |
|---|---|---|
| #2 | One package linked to many campaigns, or single campaign? | Resolved many-to-many via `PackageCampaignLink`. |
| — | Max visuals per package | Not specified in TRD; MVP allows unlimited (governed only by Storage module's size/content-type rules). Add a cap once the design specifies one. |
| — | Package edit after link | Traveler can unlink and re-link a different package; no historical record of which package was attached at donation time until #6. |
| — | Package expiration / seasonality | No auto-archive by date; agencies manually toggle `active`/`inactive`/`archived`. |
