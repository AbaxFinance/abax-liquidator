use std::{fs, path::PathBuf};

use clap::Parser;

#[derive(Debug, Parser)]
#[clap(version = "1.0")]
pub struct Config {
	/// URL address(es) of the nodes to send transactions to
	#[clap(long, default_value = "wss://ws.test.azero.dev")]
	pub ws_endpoint: String,

	/// secret seed of the account keypair passed on stdin
	#[clap(long)]
	pub seed: Option<String>,
}

pub fn read_phrase(phrase: String) -> String {
	let file = PathBuf::from(&phrase);
	if file.is_file() {
		fs::read_to_string(phrase).unwrap().trim_end().to_owned()
	} else {
		phrase
	}
}
