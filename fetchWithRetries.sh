#!/bin/bash
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

while :
do
    script -efq "$SCRIPT_DIR/fetch$(date +%s.%3N).log" -c \
    "env DEBUG=1 env NODE_OPTIONS=\"$NODE_OPTIONS --max-old-space-size=16384\" npx ts-node runWithoutWarnings.ts npx ts-node scripts/fetchEvents.ts"
done
