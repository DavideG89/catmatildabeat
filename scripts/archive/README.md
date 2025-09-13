This folder contains archived SQL migration snippets that are no longer part of the active setup but are kept for historical reference.

Files
- add-audio-file-column.sql: Adds `audio_file` column to `beats` and a comment.
- add-category-column.sql: Adds `category` column to `beats`, index, and backfills NULLs.

Notes
- Current canonical schema lives in `scripts/create-beats-table.sql`.
- Current sample data lives in `scripts/seed-beats-data.sql`.
- Storage setup scripts remain in `scripts/create-storage-bucket.sql` and `scripts/create-audio-storage-bucket.sql`.

If you need these migrations again, prefer applying the canonical schema instead.
