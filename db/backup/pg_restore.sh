#!/bin/bash
SCRIPT_DIR=$(cd ${0%/*} && pwd -P)


###########################
####### LOAD CONFIG #######
###########################

while [ $# -gt 0 ]; do
    case $1 in
        -c)
            CONFIG_FILE_PATH="$2"
            shift 2
        ;;
        *)
            ${ECHO} "Unknown Option \"$1\"" 1>&2
            exit 2
        ;;
    esac
done

if [ -z $CONFIG_FILE_PATH ] ; then
    CONFIG_FILE_PATH="${SCRIPT_DIR}/pg_backup.config"
fi

if [ ! -r ${CONFIG_FILE_PATH} ] ; then
    echo "Could not load config file from ${CONFIG_FILE_PATH}" 1>&2
    exit 1
fi

source "${CONFIG_FILE_PATH}"

###########################

PG_HOSTNAME="localhost"
POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="changeme"
BACKUP_DIR_BASE="$SCRIPT_DIR/backups"
BACKUP_ID="2024-01-03-daily"
BACKUP_DIR_TO_USE="$BACKUP_DIR_BASE/$BACKUP_ID"
GLOBALS_BP_FILENAME="globals.sql.gz"


for file in $BACKUP_DIR_TO_USE/*; do
    echo "$file"
    if [[ $file == *.custom ]]; then
        db_name=$(basename $file .custom)
        echo "db_name: $db_name"
        echo "pg_restore -h "$PG_HOSTNAME" --jobs 8 --username $POSTGRES_USER -d $db_name $file"
    fi
done

pg_restore -h "$PG_HOSTNAME" --jobs 8 --username $POSTGRES_USER --create --dbname postgres "$BACKUP_DIR_TO_USE/liquidator_db.custom"
pg_restore -h "$PG_HOSTNAME" --jobs 8 --username $POSTGRES_USER --dbname postgres "$BACKUP_DIR_TO_USE/postgres.custom"
zcat "$BACKUP_DIR_TO_USE/$GLOBALS_BP_FILENAME" | psql -h "$PG_HOSTNAME" -U $POSTGRES_USER