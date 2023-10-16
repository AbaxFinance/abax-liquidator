use std::time::Duration;

use aleph_client::{
	account_from_keypair, pallets::balances::BalanceUserApi, raw_keypair_from_string, AccountId, Balance, KeyPair,
	SignedConnection, SignedConnectionApi, TxStatus,
};
use clap::Parser;
use config::Config;
use futures::future::join_all;
use log::info;
use sp_core::{sr25519, Pair};
use tokio::{time, time::sleep};
mod config;

#[tokio::main(flavor = "multi_thread")]
async fn main() -> anyhow::Result<()> {
	env_logger::init();
	let config: Config = Config::parse();
	info!("Config {:#?}", &config);

	let account = sr25519::Pair::from_string(config.seed.as_ref().expect("Seed not provided"), None).unwrap();
	let main_connection = SignedConnection::new(&config.ws_endpoint, KeyPair::new(account.clone())).await;

	Ok(())
}
