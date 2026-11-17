# Plan Editor integration

## Stand identity

`map_features.id` is the stand/document identifier. Property-boundary polygons are also stored in `map_features`; a future property/lot discriminator should be added to `map_features` (or a stand relation) rather than creating a document table for each stand.

## Persistence

The `stand_documents` table stores one JSON BlockNote document per `(project_id, map_feature_id)` pair. Deleting a stand cascades its document because `map_feature_id` references `map_features(id, map_id)` with `ON DELETE CASCADE`.

Row-level security allows all project members to read documents and permits only owners/editors to insert, update, or delete them. Viewers receive a read-only editor.

## Future structured forestry features

- Stand Properties: add custom BlockNote blocks for structured values, but retain acreage/geometry as map feature fields. Species, stocking, basal area, and invasive severity may be custom blocks backed by normalized stand records if they need filtering/reporting.
- Management Actions: keep the existing `actions` and `action_features` (renamed from `action_stands`) records. Link actions to stands; do not copy action text into BlockNote documents.
- Field Observations: add separate spatial records keyed to map feature UUIDs and optionally embed read-only references in documents.
- Photos: store image metadata/assets separately and embed references or custom photo blocks in BlockNote content.

BlockNote is suitable for rich narrative stand plans. Structured and spatial forestry data should remain separate normalized/spatial records, with documents linking to those records by stand UUID.
