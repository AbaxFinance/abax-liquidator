#!/bin/bash
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)
rm -f "$SCRIPT_DIR/fetcher.log"
while :
do
    script -aefq "$SCRIPT_DIR/fetcher.log" -c \
    "env DEBUG=1 env NODE_OPTIONS=\"$NODE_OPTIONS --max-old-space-size=16384\" npx ts-node runWithoutWarnings.ts npx ts-node scripts/fetchEvents.ts"
    exit_code=$?
    
    # Check if the exit code is 130 (SIGINT)
    if [ $exit_code -eq 130 ]; then
        echo "Received exit code 130. Exiting the loop."
        break
    fi
done
