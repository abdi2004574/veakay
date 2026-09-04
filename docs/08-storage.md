# Storage

## Overview

Files are stored in MinIO (development) or AWS S3 (production), same AWS SDK client, a single environment variable change to switch. The backend never uploads or serves files directly, it generates presigned URLs for direct client-to-storage operations.

## Upload Flow

```text
1. Client requests a presigned upload URL.
   POST /api/v1/storage/upload-url
   { contentType: "image/jpeg", purpose: "campaign_media" }

2. Backend validates content type against an allowlist.
   Backend generates a unique object key.
   Backend creates a pending media_assets record.
   Backend generates a presigned PUT URL (valid for 15 minutes).
   Backend returns { uploadUrl, mediaId, key }.

3. Client uploads the file directly to the presigned URL.

4. Client confirms the upload to the backend.
   POST /api/v1/storage/confirm { mediaId }

5. Backend checks the object exists in storage, marks media_assets status=uploaded.
```

## Download Flow

Private files (agency documents, private campaign media) are served via presigned GET URLs with a short TTL. Public files (profile photos, public campaign/post media) are served directly or via CloudFront in production.

## Object Key Structure

```text
users/{userId}/profile-photos/{mediaId}.{ext}
campaigns/{campaignId}/media/{mediaId}.{ext}
packages/{packageId}/visuals/{mediaId}.{ext}
agencies/{agencyId}/documents/{mediaId}.{ext}
agencies/{agencyId}/logo/{mediaId}.{ext}
chats/{chatId}/media/{mediaId}.{ext}
posts/{postId}/media/{mediaId}.{ext}
```

## Allowed Content Types

```text
Profile photos        → image/jpeg, image/png, image/webp   max: 5MB
Campaign images        → image/jpeg, image/png, image/webp   max: 10MB
Package visuals         → image/jpeg, image/png, image/webp   max: 10MB
Agency documents         → application/pdf, image/jpeg, image/png   max: 20MB
Chat images               → image/jpeg, image/png, image/webp   max: 10MB
Chat documents             → application/pdf, application/msword,
                              application/vnd.openxmlformats-officedocument.wordprocessingml.document
                              max: 20MB
```

Any content type not in this allowlist is rejected at the presigned URL generation step.

## StorageService

```text
createPresignedUploadUrl(key, contentType, expiresIn)  → string
createPresignedDownloadUrl(key, expiresIn)             → string
objectExists(key)                                      → boolean
deleteObject(key)                                      → void
getObjectMetadata(key)                                 → { size, contentType, lastModified }
```

Configured via environment variables at startup, MinIO in development, AWS S3 in production.

## CDN (Production Only)

CloudFront is placed in front of S3 in production. Public media (profile photos, public campaign media, package visuals) is served via CloudFront URLs.

## Cleanup

Orphaned objects (presigned upload created but never confirmed) are cleaned up by a daily background job, any `media_assets` row in `pending` status for more than 24 hours has its object deleted.

Soft-deleted campaign/post media retains its object for 30 days to support moderation review, then a cleanup job removes it.

## Testing

### Unit Tests
- `StorageService.createPresignedUploadUrl` is mocked in unit tests.

### Live Storage Integration Test

```text
npm run test:storage
```

Verifies: MinIO bucket creation, presigned PUT URL generation and upload, `objectExists()`, `getObjectMetadata()`, presigned GET URL download, object key structure.
