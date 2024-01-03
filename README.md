# Abax Liquidator

This repository contains the source code for Abax liquidator.

## Prerequisites

- Docker Engine
- Docker Compose

## Usage

1. Clone this repository:

```shell
git clone https://github.com/AbaxFinance/abax-liquidator.git
```

2. Navigate to the project directory:

```shell
cd abax-liquidator
```

3. Change name of `.env.secret.example` to `.env.secret` and provide a seed phrase of the address that shall be a spender/receiver of liquidations.

4. Start the services:

```shell
docker-compose up -d
```

This will build and start all the required containers defined in the `docker-compose.yml` file.

4. Access misc services management UIs:

- RabbitMQ: http://localhost:15672 (username: guest, password: guest)
- PostgreSQL: localhost:5432 (username: postgres, password: changeme)
- pgAdmin: http://localhost:5050 (username: pgadmin4@pgadmin.org, password: admin)

5. Stop the services:

```shell
docker-compose down
```

## Architecture

The Abax Liquidator follows a modular architecture where high-level tasks are abstracted and encapsulated into workers, also known as actors. Each actor runs in its own container thus has a separated work context. The actors in the project connect to a PostgreSQL database and communicate with each other using queues provided by RabbitMQ. This allows for asynchronous and reliable message passing between actors. The use of queues ensures that messages are not lost even if an actor is temporarily unavailable.

The current implementation is written in Node.js with TypeScript, but each actor can be rewritten in any other language as long as it fulfills its designated task. This flexibility allows for future scalability and technology stack changes.

Logs generated by the actors are dumped to files and rotated using `log-rotate` to ensure efficient log management.

### Workers/Actors

## Workers/Actors

The Abax Liquidator consists of several workers/actors responsible for different tasks:

- ReserveDataChainUpdater: responsible for fetching the reserve data from the blockchain and inserting it into the database.
- UserDataChainUpdater: responsible for updating user data from the blockchain and inserting it into the database.
- PastBlocksProcessor: responsible for processing past blocks in the blockchain.
- EventListener: responsible for listening to and handling events from the blockchain.
- PeriodicHFUpdater: responsible for periodical Health Factors updates. The lower HF is the more frequent it gets updated. If finds HF that falls below liquidation threshold requests a liquidation.
- PriceChangeHFUpdater: responsible for updating Health Factors of addresses affected by a price change. If finds HF that falls below liquidation threshold requests a liquidation.
- Liquidator: responsible for liquidating positions. Listens for liquidation requests and processes them.
- OffChainPriceUpdater: responsible for updating off-chain prices. Utilizes KuCoin as a source.
- DIAOraclePriceUpdater: responsible for updating oracle prices.

### HF recalculation

In order to make liquidator resiliant to both time and sudden significant price changes there are two strategies regarding HF recalculation:

- price change based
- periodic based

Both strategies follow a similar process:

    - gather addresses required for the HF to be recalculated
    - perform calulations
    - if necessary request liquidation
    - update database

and differ regarding the 'source cause' of gathered addresses.

#### Periodic

This strategy involves periodic HF checks for addresses registered by liquidator. The lower HF the higher frequency of checks. The frequency is defined in `src/consts.ts` in a `UPDATE_INTERVAL_BY_HF_PRIORITY` map.

#### Price change

Database is polled and once any asset's price deviates, addresses that have positions involving the mentioned asset do get their HF recalculated.

## Configuration

The configuration options for each service can be found in the `docker-compose.yml` file. You can modify these options according to your requirements.
`.env.local.docker` contains a environment variable configuration of services environments such as postgres credentials, blockchain websocked endpoint and some log/debug config.
`.env.secret` contains a seed phrase of the address that shall be a spender/receiver of liquidations. The address is used by `liquidator` container. Without providing it all of the services will run and gather data/send liquidation requests though liquidator will not process them.

## License

This project is licensed under the [MIT License](LICENSE).
