# Backup and restore runbook

Reviewed 2026-10-22. Protect both current KOVA khccehpehasicomumani and legacy-history iqufqtjotgpmhhtvlxwf. Never use either as a restore-drill target.

## Blocking safeguard gap

The checked-in restore-drill.ps1 and restore-storage.mjs currently reject only the legacy ref. They do not yet automatically reject current KOVA or fully establish URL/ref identity. Before using them, implement/review current-target protections and independently verify the connection URL, target project and explicit confirmation all refer to a disposable non-production project. Documentation prohibitions are not an implemented runtime guard. Track this in [TASKS](../../TASKS.md).

## Backup

Database backups do not include Storage object bytes. Keep DB/schema/roles/data plus Storage backups encrypted, outside the repository, with restricted access and an off-site copy. Confirm current provider retention/PITR capabilities; do not assume a plan or an old drill proves recovery.

1. Verify source project/ref and approved operator access. Obtain database connection details securely from Supabase Connect.
2. Configure shell-only SUPABASE_DB_URL and same-project Storage access (NEXT_PUBLIC_SUPABASE_URL and server-only SUPABASE_SECRET_KEY) without logging them.
3. Read scripts/operations/backup-supabase.ps1 and verify available PostgreSQL tools before execution. Choose an encrypted output directory outside this workspace.
4. Run the reviewed backup script with -OutputRoot pointing to that directory. Existing filenames may retain legacy brand prefixes; those are not proof of the source project.
5. Require scripts/operations/verify-backup.mjs checksum/manifest success. Record source ref, timestamp, operator, manifest hash, sizes and result without credentials/customer data.

A proposed retention policy is 7 daily, 4 weekly and 12 monthly verified backups; confirm the actual business policy and storage capacity. File existence alone is not a successful restore test.

## Disposable restore drill

After the safeguard gap is fixed, inspect installed script parameters: restore-drill.ps1 takes BackupDirectory, TargetDbUrl, TargetProjectRef and ConfirmTargetProjectRef. Use a separately created disposable target, explicit exact confirmation and single-transaction error-stopping restore. Never weaken guards to accommodate a production URL.

Storage restoration separately uses RESTORE_TARGET_SUPABASE_URL, RESTORE_TARGET_SUPABASE_SECRET_KEY and RESTORE_TARGET_PROJECT_REF plus the positional confirmed ref. Create matching buckets/policies first; validate both object bytes and metadata. Do not infer safe targeting from an arbitrary ref argument.

Verify schema/history, RLS/grants, Auth callbacks, bucket privacy, product/order counts, test sign-in, sandbox transactional behavior, authorized/denied staff access and scoped proof downloads. Record measured RPO/RTO and cleanup. No current successful KOVA restore drill is claimed by the documentation baseline.

## Production recovery

A real production restore requires explicit incident authorization and a verified target/timestamp. Freeze affected mutations/deployments, preserve evidence and identify a known-good point. Use the approved provider restore/PITR procedure with independent operator confirmation. Database downtime and separate Storage restoration must be planned.

After recovery, verify credentials/callbacks/provider configuration, application/schema compatibility, access and private media. Reconcile orders/payments near the recovery point before resuming. Follow [incident response](INCIDENT_RESPONSE.md) and [release rollback](RELEASE_ROLLBACK.md); code rollback does not undo live business data.
