#!/bin/bash
set -e

dbName="liquidator_db"
$backupDirName="backup"

#restore
psql -f $backupDirName/globals.sql
psql -f $backupDirName/db-schema.sql $dbname
pg_restore -a -d $dbname -Fc $backupDirName/full.dump