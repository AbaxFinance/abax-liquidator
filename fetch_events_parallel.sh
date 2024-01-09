#!/bin/bash
SCRIPT_DIR=$(cd ${0%/*} && pwd -P)


NTH=0
START_BLOCK_NUMBER_PRE_DEPLOYMENT=48565327
APPROX_NOW=51364642
CHUNK_SIZE=500000

for (( START_BLOCK=$START_BLOCK_NUMBER_PRE_DEPLOYMENT; START_BLOCK<=$APPROX_NOW; START_BLOCK+=$CHUNK_SIZE ))
do
    END_BLOCK=$((START_BLOCK + CHUNK_SIZE - 1))
    echo "START_BLOCK: $START_BLOCK, END_BLOCK: $END_BLOCK, NTH: $NTH"

    docker run -d --restart on-failure --network abax-liquidator_local_bridge \
        --name "chunk-blocks-processor-$NTH" \
        -e ACTOR_TO_RUN=CHUNK_BLOCK_PROCESSOR \
        -e START_BLOCK="$START_BLOCK" \
        -e END_BLOCK="$END_BLOCK" \
        -e DOCKER_ENV="1" \
        -e POSTGRES_USER="postgres" \
        -e POSTGRES_PASSWORD="changme" \
        -e POSTGRES_HOST="postgres" \
        -e RPC_ENDPOINT="wss://ws.test.azero.dev" \
        -e LOG_FILENAME="chunk-blocks-processor-$NTH" \
        -v "$SCRIPT_DIR/compose-persistence/logs:/app/logs" \
        -t liquidation-node-actor
    NTH=$((NTH + 1))
done


# docker rm -f $(docker ps -a -q --filter name=chunk-blocks-processor*)