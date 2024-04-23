import type { Bytes } from '@subsquid/ink-abi';
import { Abi, encodeCall, decodeResult } from '@subsquid/ink-abi';

export const metadata = {
  source: {
    hash: '0x78cb087bd2afdaffa9f04fea3ed5f4b19de6e96b9b2e203b23df2a01badbfacb',
    language: 'ink! 4.3.0',
    compiler: 'rustc 1.72.0',
    build_info: {
      build_mode: 'Release',
      cargo_contract_version: '3.2.0',
      rust_toolchain: 'stable-x86_64-unknown-linux-gnu',
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: 'Z',
      },
    },
  },
  contract: {
    name: 'lending_pool',
    version: '0.1.1',
    authors: ['Konrad Wierzbik <konrad.wierzbik@gmail.com>'],
  },
  spec: {
    constructors: [
      {
        args: [],
        default: false,
        docs: [],
        label: 'new',
        payable: false,
        returnType: {
          displayName: ['ink_primitives', 'ConstructorResult'],
          type: 12,
        },
        selector: '0x9bae9d5e',
      },
    ],
    docs: [],
    environment: {
      accountId: {
        displayName: ['AccountId'],
        type: 2,
      },
      balance: {
        displayName: ['Balance'],
        type: 9,
      },
      blockNumber: {
        displayName: ['BlockNumber'],
        type: 0,
      },
      chainExtension: {
        displayName: ['ChainExtension'],
        type: 76,
      },
      hash: {
        displayName: ['Hash'],
        type: 75,
      },
      maxEventTopics: 4,
      timestamp: {
        displayName: ['Timestamp'],
        type: 11,
      },
    },
    events: [
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'Deposit',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'Redeem',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 0,
            },
          },
        ],
        docs: [],
        label: 'MarketRuleChosen',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'set',
            type: {
              displayName: ['bool'],
              type: 10,
            },
          },
        ],
        docs: [],
        label: 'CollateralSet',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'BorrowVariable',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'RepayVariable',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'receiver_address',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'fee',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'FlashLoan',
      },
      {
        args: [
          {
            docs: [],
            indexed: false,
            label: 'liquidator',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset_to_repay',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset_to_take',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount_repaid',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount_taken',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'Liquidation',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        docs: [],
        label: 'InterestsAccumulated',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        docs: [],
        label: 'UserInterestsAccumulated',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        docs: [],
        label: 'RateRebalanced',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'decimals',
            type: {
              displayName: ['u8'],
              type: 4,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'name',
            type: {
              displayName: ['String'],
              type: 18,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'symbol',
            type: {
              displayName: ['String'],
              type: 18,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'a_token_code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'v_token_code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'a_token_address',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'v_token_address',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        docs: [],
        label: 'AssetRegistered',
      },
      {
        args: [
          {
            docs: [],
            indexed: false,
            label: 'price_feed_provider',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        docs: [],
        label: 'PriceFeedProviderChanged',
      },
      {
        args: [
          {
            docs: [],
            indexed: false,
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'FlashLoanFeeChanged',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'active',
            type: {
              displayName: ['bool'],
              type: 10,
            },
          },
        ],
        docs: [],
        label: 'ReserveActivated',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'freezed',
            type: {
              displayName: ['bool'],
              type: 10,
            },
          },
        ],
        docs: [],
        label: 'ReserveFreezed',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'interest_rate_model',
            type: {
              displayName: [],
              type: 33,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'ReserveParametersChanged',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'maximal_total_deposit',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'ReserveRestrictionsChanged',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 0,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
        ],
        docs: [],
        label: 'AssetRulesChanged',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        docs: [],
        label: 'IncomeTaken',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'debt_rate_e24',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        docs: [],
        label: 'StablecoinDebtRateChanged',
      },
    ],
    lang_error: {
      displayName: ['ink', 'LangError'],
      type: 13,
    },
    messages: [
      {
        args: [
          {
            label: 'code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'set_code',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x694fb50f',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolDeposit::deposit',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xc9dd3a65',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolDeposit::redeem',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 26,
        },
        selector: '0x97a42fe1',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolBorrow::choose_market_rule',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xc92e73af',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'use_as_collateral',
            type: {
              displayName: ['bool'],
              type: 10,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolBorrow::set_as_collateral',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xec3848d8',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolBorrow::borrow',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xdd556dad',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolBorrow::repay',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 26,
        },
        selector: '0xde645a1e',
      },
      {
        args: [
          {
            label: 'receiver_address',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'assets',
            type: {
              displayName: ['Vec'],
              type: 28,
            },
          },
          {
            label: 'amounts',
            type: {
              displayName: ['Vec'],
              type: 29,
            },
          },
          {
            label: 'receiver_params',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolFlash::flash_loan',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x81b31ee7',
      },
      {
        args: [
          {
            label: 'liquidated_user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'asset_to_repay',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'asset_to_take',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount_to_repay',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'minimum_recieved_for_one_repaid_token_e18',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolLiquidate::liquidate',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 30,
        },
        selector: '0x6d61b4a5',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolMaintain::accumulate_interest',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xf58c7316',
      },
      {
        args: [
          {
            label: 'price_feed_provider',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_price_feed_provider',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x0803b99f',
      },
      {
        args: [
          {
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_flash_loan_fee_e6',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x02b32af2',
      },
      {
        args: [
          {
            label: 'provider_address',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_block_timestamp_provider',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x70511e1a',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'a_token_code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
          {
            label: 'v_token_code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
          {
            label: 'name',
            type: {
              displayName: ['String'],
              type: 18,
            },
          },
          {
            label: 'symbol',
            type: {
              displayName: ['String'],
              type: 18,
            },
          },
          {
            label: 'decimals',
            type: {
              displayName: ['u8'],
              type: 4,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'maximal_total_deposit',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
          {
            label: 'interest_rate_model',
            type: {
              displayName: [],
              type: 33,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::register_asset',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x63ca0624',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'a_token_code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
          {
            label: 'v_token_code_hash',
            type: {
              displayName: [],
              type: 3,
            },
          },
          {
            label: 'name',
            type: {
              displayName: ['String'],
              type: 18,
            },
          },
          {
            label: 'symbol',
            type: {
              displayName: ['String'],
              type: 18,
            },
          },
          {
            label: 'decimals',
            type: {
              displayName: ['u8'],
              type: 4,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'maximal_total_deposit',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::register_stablecoin',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x450bbe5a',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'active',
            type: {
              displayName: ['bool'],
              type: 10,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_reserve_is_active',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x1896b613',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'freeze',
            type: {
              displayName: ['bool'],
              type: 10,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_reserve_is_freezed',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xc4f08136',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'interest_rate_model',
            type: {
              displayName: [],
              type: 33,
            },
          },
          {
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_reserve_parameters',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xda202b32',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'maximal_total_deposit',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_reserve_restrictions',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x65e86045',
      },
      {
        args: [
          {
            label: 'market_rule',
            type: {
              displayName: ['MarketRule'],
              type: 5,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::add_market_rule',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xc240467e',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 0,
            },
          },
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 8,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::modify_asset_rule',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x276c5154',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['Option'],
              type: 34,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::take_protocol_income',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 35,
        },
        selector: '0x01144880',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'debt_rate_e24',
            type: {
              displayName: ['u128'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolManage::set_stablecoin_debt_rate_e24',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0xa3aa05c6',
      },
      {
        args: [],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_flash_loan_fee_e6',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 40,
        },
        selector: '0x03acc819',
      },
      {
        args: [
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_asset_id',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 41,
        },
        selector: '0x82c726b7',
      },
      {
        args: [],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_registered_assets',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 43,
        },
        selector: '0x7ee520ac',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_unupdated_reserve_data',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 44,
        },
        selector: '0x1eea06d8',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_data',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 44,
        },
        selector: '0xc4adf4e3',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_unupdated_reserve_indexes',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 47,
        },
        selector: '0x2b038385',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_parameters',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 50,
        },
        selector: '0xd71538f5',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_restrictions',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 53,
        },
        selector: '0xe27ee044',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_tokens',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 56,
        },
        selector: '0x6ea8d1e8',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_decimal_multiplier',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 59,
        },
        selector: '0x98295700',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_indexes',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 47,
        },
        selector: '0xd179c3bb',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_unupdated_user_reserve_data',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 60,
        },
        selector: '0xb9dff1c2',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_user_reserve_data',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 60,
        },
        selector: '0xbf86b805',
      },
      {
        args: [
          {
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_user_config',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 62,
        },
        selector: '0xe6ef16de',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_market_rule',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 64,
        },
        selector: '0x5e701ec3',
      },
      {
        args: [
          {
            label: 'user_address',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::get_user_free_collateral_coefficient',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 66,
        },
        selector: '0xd802407c',
      },
      {
        args: [],
        default: false,
        docs: [],
        label: 'LendingPoolView::get_block_timestamp_provider_address',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 68,
        },
        selector: '0xe598e179',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['Option'],
              type: 34,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_protocol_income',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 69,
        },
        selector: '0xa6121b9f',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolATokenInterface::total_deposit_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 40,
        },
        selector: '0x58114dc5',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolATokenInterface::user_deposit_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 40,
        },
        selector: '0x64ec04d9',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'from',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolATokenInterface::transfer_deposit_from_to',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 30,
        },
        selector: '0x48009b8d',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolVTokenInterface::total_debt_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 40,
        },
        selector: '0x89418024',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolVTokenInterface::user_debt_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 40,
        },
        selector: '0x3ca3809a',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'from',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['AccountId'],
              type: 2,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 9,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolVTokenInterface::transfer_debt_from_to',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 30,
        },
        selector: '0x714b3576',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 0,
            },
          },
          {
            label: 'address',
            type: {
              displayName: ['Option'],
              type: 70,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'AccessControl::has_role',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 71,
        },
        selector: '0xc1d9ac18',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 0,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'AccessControl::get_role_admin',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 72,
        },
        selector: '0x83da3bb2',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 0,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['Option'],
              type: 70,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'AccessControl::grant_role',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 73,
        },
        selector: '0x4ac062fd',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 0,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['Option'],
              type: 70,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'AccessControl::revoke_role',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 73,
        },
        selector: '0x6e4f0991',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 0,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['Option'],
              type: 70,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'AccessControl::renounce_role',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 73,
        },
        selector: '0xeaf1248a',
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                struct: {
                  fields: [
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0xe9211bfd',
                              ty: 0,
                            },
                          },
                          root_key: '0xe9211bfd',
                        },
                      },
                      name: 'admin_roles',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0xd7c7cfc1',
                              ty: 1,
                            },
                          },
                          root_key: '0xd7c7cfc1',
                        },
                      },
                      name: 'members',
                    },
                  ],
                  name: 'Data',
                },
              },
              name: 'access',
            },
            {
              layout: {
                struct: {
                  fields: [
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x7682eccc',
                              ty: 2,
                            },
                          },
                          root_key: '0x7682eccc',
                        },
                      },
                      name: 'block_timestamp_provider',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x5add0ca3',
                              ty: 2,
                            },
                          },
                          root_key: '0x5add0ca3',
                        },
                      },
                      name: 'price_feed_provider',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x5776e292',
                              ty: 0,
                            },
                          },
                          root_key: '0x5776e292',
                        },
                      },
                      name: 'next_asset_id',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x25cd3777',
                              ty: 0,
                            },
                          },
                          root_key: '0x25cd3777',
                        },
                      },
                      name: 'asset_to_id',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x24126ed0',
                              ty: 2,
                            },
                          },
                          root_key: '0x24126ed0',
                        },
                      },
                      name: 'id_to_asset',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x8e2755ff',
                              ty: 0,
                            },
                          },
                          root_key: '0x8e2755ff',
                        },
                      },
                      name: 'next_rule_id',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0xbfc232d0',
                              ty: 5,
                            },
                          },
                          root_key: '0xbfc232d0',
                        },
                      },
                      name: 'market_rules',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x4cd1edae',
                                      ty: 2,
                                    },
                                  },
                                  name: 'a_token_address',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x4cd1edae',
                                      ty: 2,
                                    },
                                  },
                                  name: 'v_token_address',
                                },
                              ],
                              name: 'ReserveAbacusTokens',
                            },
                          },
                          root_key: '0x4cd1edae',
                        },
                      },
                      name: 'reserve_abacus_tokens',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    enum: {
                                      dispatchKey: '0xe19bbd17',
                                      name: 'Option',
                                      variants: {
                                        '0': {
                                          fields: [],
                                          name: 'None',
                                        },
                                        '1': {
                                          fields: [
                                            {
                                              layout: {
                                                leaf: {
                                                  key: '0xe19bbd17',
                                                  ty: 9,
                                                },
                                              },
                                              name: '0',
                                            },
                                          ],
                                          name: 'Some',
                                        },
                                      },
                                    },
                                  },
                                  name: 'maximal_total_deposit',
                                },
                                {
                                  layout: {
                                    enum: {
                                      dispatchKey: '0xe19bbd17',
                                      name: 'Option',
                                      variants: {
                                        '0': {
                                          fields: [],
                                          name: 'None',
                                        },
                                        '1': {
                                          fields: [
                                            {
                                              layout: {
                                                leaf: {
                                                  key: '0xe19bbd17',
                                                  ty: 9,
                                                },
                                              },
                                              name: '0',
                                            },
                                          ],
                                          name: 'Some',
                                        },
                                      },
                                    },
                                  },
                                  name: 'maximal_total_debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xe19bbd17',
                                      ty: 9,
                                    },
                                  },
                                  name: 'minimal_collateral',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xe19bbd17',
                                      ty: 9,
                                    },
                                  },
                                  name: 'minimal_debt',
                                },
                              ],
                              name: 'ReserveRestrictions',
                            },
                          },
                          root_key: '0xe19bbd17',
                        },
                      },
                      name: 'reserve_restrictions',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xd075ddd3',
                                      ty: 9,
                                    },
                                  },
                                  name: 'cumulative_deposit_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xd075ddd3',
                                      ty: 9,
                                    },
                                  },
                                  name: 'cumulative_debt_index_e18',
                                },
                              ],
                              name: 'ReserveIndexes',
                            },
                          },
                          root_key: '0xd075ddd3',
                        },
                      },
                      name: 'reserve_indexes',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x2b0c8302',
                              ty: 9,
                            },
                          },
                          root_key: '0x2b0c8302',
                        },
                      },
                      name: 'reserve_decimal_multiplier',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 10,
                                    },
                                  },
                                  name: 'activated',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 10,
                                    },
                                  },
                                  name: 'freezed',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 9,
                                    },
                                  },
                                  name: 'total_deposit',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 9,
                                    },
                                  },
                                  name: 'current_deposit_rate_e24',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 9,
                                    },
                                  },
                                  name: 'total_debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 9,
                                    },
                                  },
                                  name: 'current_debt_rate_e24',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 11,
                                    },
                                  },
                                  name: 'indexes_update_timestamp',
                                },
                              ],
                              name: 'ReserveData',
                            },
                          },
                          root_key: '0x79bca6dd',
                        },
                      },
                      name: 'reserve_datas',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    array: {
                                      layout: {
                                        leaf: {
                                          key: '0x08519baf',
                                          ty: 9,
                                        },
                                      },
                                      len: 7,
                                      offset: '0x08519baf',
                                    },
                                  },
                                  name: 'interest_rate_model',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x08519baf',
                                      ty: 9,
                                    },
                                  },
                                  name: 'income_for_suppliers_part_e6',
                                },
                              ],
                              name: 'ReserveParameters',
                            },
                          },
                          root_key: '0x08519baf',
                        },
                      },
                      name: 'reserve_parameters',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 9,
                                    },
                                  },
                                  name: 'deposit',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 9,
                                    },
                                  },
                                  name: 'debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 9,
                                    },
                                  },
                                  name: 'applied_cumulative_deposit_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 9,
                                    },
                                  },
                                  name: 'applied_cumulative_debt_index_e18',
                                },
                              ],
                              name: 'UserReserveData',
                            },
                          },
                          root_key: '0x207f5774',
                        },
                      },
                      name: 'user_reserve_datas',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 9,
                                    },
                                  },
                                  name: 'deposits',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 9,
                                    },
                                  },
                                  name: 'collaterals',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 9,
                                    },
                                  },
                                  name: 'borrows',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 0,
                                    },
                                  },
                                  name: 'market_rule_id',
                                },
                              ],
                              name: 'UserConfig',
                            },
                          },
                          root_key: '0x292a3168',
                        },
                      },
                      name: 'user_configs',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x719a8df6',
                              ty: 9,
                            },
                          },
                          root_key: '0x719a8df6',
                        },
                      },
                      name: 'flash_loan_fee_e6',
                    },
                  ],
                  name: 'LendingPoolStorage',
                },
              },
              name: 'lending_pool',
            },
          ],
          name: 'LendingPool',
        },
      },
      root_key: '0x00000000',
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          primitive: 'u32',
        },
      },
    },
    {
      id: 1,
      type: {
        def: {
          tuple: [],
        },
      },
    },
    {
      id: 2,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 3,
                typeName: '[u8; 32]',
              },
            ],
          },
        },
        path: ['ink_primitives', 'types', 'AccountId'],
      },
    },
    {
      id: 3,
      type: {
        def: {
          array: {
            len: 32,
            type: 4,
          },
        },
      },
    },
    {
      id: 4,
      type: {
        def: {
          primitive: 'u8',
        },
      },
    },
    {
      id: 5,
      type: {
        def: {
          sequence: {
            type: 6,
          },
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 7,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 7,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 7,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'collateral_coefficient_e6',
                type: 8,
                typeName: 'Option<u128>',
              },
              {
                name: 'borrow_coefficient_e6',
                type: 8,
                typeName: 'Option<u128>',
              },
              {
                name: 'penalty_e6',
                type: 8,
                typeName: 'Option<u128>',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'asset_rules', 'AssetRules'],
      },
    },
    {
      id: 8,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 9,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 9,
      type: {
        def: {
          primitive: 'u128',
        },
      },
    },
    {
      id: 10,
      type: {
        def: {
          primitive: 'bool',
        },
      },
    },
    {
      id: 11,
      type: {
        def: {
          primitive: 'u64',
        },
      },
    },
    {
      id: 12,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 1,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 1,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 13,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 1,
                name: 'CouldNotReadInput',
              },
            ],
          },
        },
        path: ['ink_primitives', 'LangError'],
      },
    },
    {
      id: 14,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 15,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 15,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 15,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 1,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 1,
          },
          {
            name: 'E',
            type: 16,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 16,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 17,
                    typeName: 'PSP22Error',
                  },
                ],
                index: 0,
                name: 'PSP22Error',
              },
              {
                fields: [
                  {
                    type: 20,
                    typeName: 'FlashLoanReceiverError',
                  },
                ],
                index: 1,
                name: 'FlashLoanReceiverError',
              },
              {
                fields: [
                  {
                    type: 21,
                    typeName: 'AccessControlError',
                  },
                ],
                index: 2,
                name: 'AccessControlError',
              },
              {
                fields: [
                  {
                    type: 22,
                    typeName: 'PausableError',
                  },
                ],
                index: 3,
                name: 'PausableError',
              },
              {
                fields: [
                  {
                    type: 23,
                    typeName: 'MathError',
                  },
                ],
                index: 4,
                name: 'MathError',
              },
              {
                fields: [
                  {
                    type: 24,
                    typeName: 'PriceFeedError',
                  },
                ],
                index: 5,
                name: 'PriceFeedError',
              },
              {
                index: 6,
                name: 'Inactive',
              },
              {
                index: 7,
                name: 'AlreadySet',
              },
              {
                index: 8,
                name: 'Freezed',
              },
              {
                index: 9,
                name: 'AlreadyRegistered',
              },
              {
                index: 10,
                name: 'AssetNotRegistered',
              },
              {
                index: 11,
                name: 'AssetIsProtocolStablecoin',
              },
              {
                index: 12,
                name: 'RuleBorrowDisable',
              },
              {
                index: 13,
                name: 'RuleCollateralDisable',
              },
              {
                index: 14,
                name: 'InsufficientCollateral',
              },
              {
                index: 15,
                name: 'MinimalCollateralDeposit',
              },
              {
                index: 16,
                name: 'MinimalDebt',
              },
              {
                index: 17,
                name: 'InsufficientDebt',
              },
              {
                index: 18,
                name: 'Collaterized',
              },
              {
                index: 19,
                name: 'InsufficientDeposit',
              },
              {
                index: 20,
                name: 'MinimumRecieved',
              },
              {
                index: 21,
                name: 'AmountNotGreaterThanZero',
              },
              {
                index: 22,
                name: 'AssetPriceNotInitialized',
              },
              {
                index: 23,
                name: 'NothingToRepay',
              },
              {
                index: 24,
                name: 'NothingToCompensateWith',
              },
              {
                index: 25,
                name: 'RepayingWithACollateral',
              },
              {
                index: 26,
                name: 'TakingNotACollateral',
              },
              {
                index: 27,
                name: 'FlashLoanAmountsAssetsInconsistentLengths',
              },
              {
                index: 28,
                name: 'MaxDepositReached',
              },
              {
                index: 29,
                name: 'MaxDebtReached',
              },
              {
                index: 30,
                name: 'MarketRuleInvalidAssetId',
              },
              {
                index: 31,
                name: 'MarketRuleInvalidId',
              },
              {
                index: 32,
                name: 'MarketRulePenaltyNotSet',
              },
              {
                index: 33,
                name: 'PriceMissing',
              },
              {
                index: 34,
                name: 'AccumulatedAlready',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'lending_pool', 'errors', 'LendingPoolError'],
      },
    },
    {
      id: 17,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 18,
                    typeName: 'String',
                  },
                ],
                index: 0,
                name: 'Custom',
              },
              {
                index: 1,
                name: 'InsufficientBalance',
              },
              {
                index: 2,
                name: 'InsufficientAllowance',
              },
              {
                index: 3,
                name: 'ZeroRecipientAddress',
              },
              {
                index: 4,
                name: 'ZeroSenderAddress',
              },
              {
                fields: [
                  {
                    type: 18,
                    typeName: 'String',
                  },
                ],
                index: 5,
                name: 'SafeTransferCheckFailed',
              },
              {
                index: 6,
                name: 'PermitInvalidSignature',
              },
              {
                index: 7,
                name: 'PermitExpired',
              },
              {
                fields: [
                  {
                    type: 19,
                    typeName: 'NoncesError',
                  },
                ],
                index: 8,
                name: 'NoncesError',
              },
            ],
          },
        },
        path: ['pendzl_contracts', 'traits', 'errors', 'psp22', 'PSP22Error'],
      },
    },
    {
      id: 18,
      type: {
        def: {
          primitive: 'str',
        },
      },
    },
    {
      id: 19,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 2,
                    typeName: 'AccountId',
                  },
                  {
                    type: 11,
                    typeName: 'u64',
                  },
                ],
                index: 0,
                name: 'InvalidAccountNonce',
              },
              {
                index: 1,
                name: 'NonceOverflow',
              },
            ],
          },
        },
        path: ['pendzl_contracts', 'traits', 'errors', 'nonces', 'NoncesError'],
      },
    },
    {
      id: 20,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'InsufficientBalance',
              },
              {
                index: 1,
                name: 'AssetNotMintable',
              },
              {
                index: 2,
                name: 'CantApprove',
              },
              {
                index: 3,
                name: 'ExecuteOperationFailed',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'flash_loan_receiver', 'FlashLoanReceiverError'],
      },
    },
    {
      id: 21,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'InvalidCaller',
              },
              {
                index: 1,
                name: 'MissingRole',
              },
              {
                index: 2,
                name: 'RoleRedundant',
              },
            ],
          },
        },
        path: ['pendzl_contracts', 'traits', 'errors', 'access_control', 'AccessControlError'],
      },
    },
    {
      id: 22,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'Paused',
              },
              {
                index: 1,
                name: 'NotPaused',
              },
            ],
          },
        },
        path: ['pendzl_contracts', 'traits', 'errors', 'pausable', 'PausableError'],
      },
    },
    {
      id: 23,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'Overflow',
              },
              {
                index: 1,
                name: 'DivByZero',
              },
              {
                index: 2,
                name: 'Underflow',
              },
            ],
          },
        },
        path: ['lending_project', 'library', 'math', 'MathError'],
      },
    },
    {
      id: 24,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'NoSuchAsset',
              },
              {
                index: 1,
                name: 'NoPriceFeed',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'price_feed', 'price_feed', 'PriceFeedError'],
      },
    },
    {
      id: 25,
      type: {
        def: {
          sequence: {
            type: 4,
          },
        },
      },
    },
    {
      id: 26,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 27,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 27,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 27,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 9,
          },
          {
            name: 'E',
            type: 16,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 28,
      type: {
        def: {
          sequence: {
            type: 2,
          },
        },
      },
    },
    {
      id: 29,
      type: {
        def: {
          sequence: {
            type: 9,
          },
        },
      },
    },
    {
      id: 30,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 31,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 31,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 31,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 32,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 32,
          },
          {
            name: 'E',
            type: 16,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 32,
      type: {
        def: {
          tuple: [9, 9],
        },
      },
    },
    {
      id: 33,
      type: {
        def: {
          array: {
            len: 7,
            type: 9,
          },
        },
      },
    },
    {
      id: 34,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 28,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 28,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 35,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 36,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 36,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 36,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 37,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 37,
          },
          {
            name: 'E',
            type: 16,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 37,
      type: {
        def: {
          sequence: {
            type: 38,
          },
        },
      },
    },
    {
      id: 38,
      type: {
        def: {
          tuple: [2, 39],
        },
      },
    },
    {
      id: 39,
      type: {
        def: {
          primitive: 'i128',
        },
      },
    },
    {
      id: 40,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 9,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 41,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 42,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 42,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 42,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 0,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 0,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 43,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 28,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 28,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 44,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 45,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 45,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 45,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 46,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 46,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 46,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'activated',
                type: 10,
                typeName: 'bool',
              },
              {
                name: 'freezed',
                type: 10,
                typeName: 'bool',
              },
              {
                name: 'total_deposit',
                type: 9,
                typeName: 'Balance',
              },
              {
                name: 'current_deposit_rate_e24',
                type: 9,
                typeName: 'u128',
              },
              {
                name: 'total_debt',
                type: 9,
                typeName: 'Balance',
              },
              {
                name: 'current_debt_rate_e24',
                type: 9,
                typeName: 'u128',
              },
              {
                name: 'indexes_update_timestamp',
                type: 11,
                typeName: 'Timestamp',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveData'],
      },
    },
    {
      id: 47,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 48,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 48,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 48,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 49,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 49,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 49,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'cumulative_deposit_index_e18',
                type: 9,
                typeName: 'u128',
              },
              {
                name: 'cumulative_debt_index_e18',
                type: 9,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveIndexes'],
      },
    },
    {
      id: 50,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 51,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 51,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 51,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 52,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 52,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 52,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'interest_rate_model',
                type: 33,
                typeName: '[u128; 7]',
              },
              {
                name: 'income_for_suppliers_part_e6',
                type: 9,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveParameters'],
      },
    },
    {
      id: 53,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 54,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 54,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 54,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 55,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 55,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 55,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'maximal_total_deposit',
                type: 8,
                typeName: 'Option<Balance>',
              },
              {
                name: 'maximal_total_debt',
                type: 8,
                typeName: 'Option<Balance>',
              },
              {
                name: 'minimal_collateral',
                type: 9,
                typeName: 'Balance',
              },
              {
                name: 'minimal_debt',
                type: 9,
                typeName: 'Balance',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveRestrictions'],
      },
    },
    {
      id: 56,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 57,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 57,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 57,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 58,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 58,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 58,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'a_token_address',
                type: 2,
                typeName: 'AccountId',
              },
              {
                name: 'v_token_address',
                type: 2,
                typeName: 'AccountId',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveAbacusTokens'],
      },
    },
    {
      id: 59,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 8,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 8,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 60,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 61,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 61,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 61,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'deposit',
                type: 9,
                typeName: 'Balance',
              },
              {
                name: 'debt',
                type: 9,
                typeName: 'Balance',
              },
              {
                name: 'applied_cumulative_deposit_index_e18',
                type: 9,
                typeName: 'u128',
              },
              {
                name: 'applied_cumulative_debt_index_e18',
                type: 9,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'user_reserve_data', 'UserReserveData'],
      },
    },
    {
      id: 62,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 63,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 63,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 63,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'deposits',
                type: 9,
                typeName: 'Bitmap128',
              },
              {
                name: 'collaterals',
                type: 9,
                typeName: 'Bitmap128',
              },
              {
                name: 'borrows',
                type: 9,
                typeName: 'Bitmap128',
              },
              {
                name: 'market_rule_id',
                type: 0,
                typeName: 'u32',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'user_config', 'UserConfig'],
      },
    },
    {
      id: 64,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 65,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 65,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 65,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 5,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 5,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 66,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 67,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 67,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 67,
      type: {
        def: {
          tuple: [10, 9],
        },
      },
    },
    {
      id: 68,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 2,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 2,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 69,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 37,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 37,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 70,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 2,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 2,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 71,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 10,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 10,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 72,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 0,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 0,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 73,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 74,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 13,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 74,
          },
          {
            name: 'E',
            type: 13,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 74,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 1,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 21,
                  },
                ],
                index: 1,
                name: 'Err',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 1,
          },
          {
            name: 'E',
            type: 21,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 75,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 3,
                typeName: '[u8; 32]',
              },
            ],
          },
        },
        path: ['ink_primitives', 'types', 'Hash'],
      },
    },
    {
      id: 76,
      type: {
        def: {
          variant: {},
        },
        path: ['ink_env', 'types', 'NoChainExtension'],
      },
    },
  ],
  version: '4',
};

const _abi = new Abi(metadata);

export function decodeEvent(bytes: Bytes): Event {
  return _abi.decodeEvent(bytes);
}

export function decodeMessage(bytes: Bytes): Message {
  return _abi.decodeMessage(bytes);
}

export function decodeConstructor(bytes: Bytes): Constructor {
  return _abi.decodeConstructor(bytes);
}

export interface Chain {
  rpc: {
    call<T = any>(method: string, params?: unknown[]): Promise<T>;
  };
}

export interface ChainContext {
  _chain: Chain;
}

export class Contract {
  constructor(
    private ctx: ChainContext,
    private address: Bytes,
    private blockHash?: Bytes,
  ) {}

  LendingPoolView_view_flash_loan_fee_e6(): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x03acc819', []);
  }

  LendingPoolView_view_asset_id(account: AccountId): Promise<Result<number | undefined, LangError>> {
    return this.stateCall('0x82c726b7', [account]);
  }

  LendingPoolView_view_registered_assets(): Promise<Result<AccountId[], LangError>> {
    return this.stateCall('0x7ee520ac', []);
  }

  LendingPoolView_view_unupdated_reserve_data(asset: AccountId): Promise<Result<ReserveData | undefined, LangError>> {
    return this.stateCall('0x1eea06d8', [asset]);
  }

  LendingPoolView_view_reserve_data(asset: AccountId): Promise<Result<ReserveData | undefined, LangError>> {
    return this.stateCall('0xc4adf4e3', [asset]);
  }

  LendingPoolView_view_unupdated_reserve_indexes(asset: AccountId): Promise<Result<ReserveIndexes | undefined, LangError>> {
    return this.stateCall('0x2b038385', [asset]);
  }

  LendingPoolView_view_reserve_parameters(asset: AccountId): Promise<Result<ReserveParameters | undefined, LangError>> {
    return this.stateCall('0xd71538f5', [asset]);
  }

  LendingPoolView_view_reserve_restrictions(asset: AccountId): Promise<Result<ReserveRestrictions | undefined, LangError>> {
    return this.stateCall('0xe27ee044', [asset]);
  }

  LendingPoolView_view_reserve_tokens(asset: AccountId): Promise<Result<ReserveAbacusTokens | undefined, LangError>> {
    return this.stateCall('0x6ea8d1e8', [asset]);
  }

  LendingPoolView_view_reserve_decimal_multiplier(asset: AccountId): Promise<Result<bigint | undefined, LangError>> {
    return this.stateCall('0x98295700', [asset]);
  }

  LendingPoolView_view_reserve_indexes(asset: AccountId): Promise<Result<ReserveIndexes | undefined, LangError>> {
    return this.stateCall('0xd179c3bb', [asset]);
  }

  LendingPoolView_view_unupdated_user_reserve_data(asset: AccountId, account: AccountId): Promise<Result<UserReserveData, LangError>> {
    return this.stateCall('0xb9dff1c2', [asset, account]);
  }

  LendingPoolView_view_user_reserve_data(asset: AccountId, account: AccountId): Promise<Result<UserReserveData, LangError>> {
    return this.stateCall('0xbf86b805', [asset, account]);
  }

  LendingPoolView_view_user_config(user: AccountId): Promise<Result<UserConfig, LangError>> {
    return this.stateCall('0xe6ef16de', [user]);
  }

  LendingPoolView_view_market_rule(market_rule_id: number): Promise<Result<(AssetRules | undefined)[] | undefined, LangError>> {
    return this.stateCall('0x5e701ec3', [market_rule_id]);
  }

  LendingPoolView_get_user_free_collateral_coefficient(user_address: AccountId): Promise<Result<[bool, bigint], LangError>> {
    return this.stateCall('0xd802407c', [user_address]);
  }

  LendingPoolView_get_block_timestamp_provider_address(): Promise<Result<AccountId, LangError>> {
    return this.stateCall('0xe598e179', []);
  }

  LendingPoolView_view_protocol_income(assets: AccountId[] | undefined): Promise<Result<[AccountId, bigint][], LangError>> {
    return this.stateCall('0xa6121b9f', [assets]);
  }

  LendingPoolATokenInterface_total_deposit_of(underlying_asset: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x58114dc5', [underlying_asset]);
  }

  LendingPoolATokenInterface_user_deposit_of(underlying_asset: AccountId, user: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x64ec04d9', [underlying_asset, user]);
  }

  LendingPoolVTokenInterface_total_debt_of(underlying_asset: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x89418024', [underlying_asset]);
  }

  LendingPoolVTokenInterface_user_debt_of(underlying_asset: AccountId, user: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x3ca3809a', [underlying_asset, user]);
  }

  AccessControl_has_role(role: number, address: AccountId | undefined): Promise<Result<bool, LangError>> {
    return this.stateCall('0xc1d9ac18', [role, address]);
  }

  AccessControl_get_role_admin(role: number): Promise<Result<number, LangError>> {
    return this.stateCall('0x83da3bb2', [role]);
  }

  private async stateCall<T>(selector: string, args: any[]): Promise<T> {
    const input = _abi.encodeMessageInput(selector, args);
    const data = encodeCall(this.address, input);
    const result = await this.ctx._chain.rpc.call('state_call', ['ContractsApi_call', data, this.blockHash]);
    const value = decodeResult(result);
    return _abi.decodeMessageOutput(selector, value);
  }
}

export type bool = boolean;

export interface AssetRules {
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
}

export interface UserConfig {
  deposits: bigint;
  collaterals: bigint;
  borrows: bigint;
  marketRuleId: number;
}

export interface UserReserveData {
  deposit: bigint;
  debt: bigint;
  appliedCumulativeDepositIndexE18: bigint;
  appliedCumulativeDebtIndexE18: bigint;
}

export interface ReserveAbacusTokens {
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export interface ReserveRestrictions {
  maximalTotalDeposit?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
}

export interface ReserveParameters {
  interestRateModel: bigint[];
  incomeForSuppliersPartE6: bigint;
}

export interface ReserveIndexes {
  cumulativeDepositIndexE18: bigint;
  cumulativeDebtIndexE18: bigint;
}

export interface ReserveData {
  activated: bool;
  freezed: bool;
  totalDeposit: bigint;
  currentDepositRateE24: bigint;
  totalDebt: bigint;
  currentDebtRateE24: bigint;
  indexesUpdateTimestamp: bigint;
}

export type AccountId = Bytes;

export type LangError = LangError_CouldNotReadInput;

export interface LangError_CouldNotReadInput {
  __kind: 'CouldNotReadInput';
}

export type Constructor = Constructor_new;

export interface Constructor_new {
  __kind: 'new';
}

export type Message =
  | Message_AccessControl_get_role_admin
  | Message_AccessControl_grant_role
  | Message_AccessControl_has_role
  | Message_AccessControl_renounce_role
  | Message_AccessControl_revoke_role
  | Message_LendingPoolATokenInterface_total_deposit_of
  | Message_LendingPoolATokenInterface_transfer_deposit_from_to
  | Message_LendingPoolATokenInterface_user_deposit_of
  | Message_LendingPoolBorrow_borrow
  | Message_LendingPoolBorrow_choose_market_rule
  | Message_LendingPoolBorrow_repay
  | Message_LendingPoolBorrow_set_as_collateral
  | Message_LendingPoolDeposit_deposit
  | Message_LendingPoolDeposit_redeem
  | Message_LendingPoolFlash_flash_loan
  | Message_LendingPoolLiquidate_liquidate
  | Message_LendingPoolMaintain_accumulate_interest
  | Message_LendingPoolManage_add_market_rule
  | Message_LendingPoolManage_modify_asset_rule
  | Message_LendingPoolManage_register_asset
  | Message_LendingPoolManage_register_stablecoin
  | Message_LendingPoolManage_set_block_timestamp_provider
  | Message_LendingPoolManage_set_flash_loan_fee_e6
  | Message_LendingPoolManage_set_price_feed_provider
  | Message_LendingPoolManage_set_reserve_is_active
  | Message_LendingPoolManage_set_reserve_is_freezed
  | Message_LendingPoolManage_set_reserve_parameters
  | Message_LendingPoolManage_set_reserve_restrictions
  | Message_LendingPoolManage_set_stablecoin_debt_rate_e24
  | Message_LendingPoolManage_take_protocol_income
  | Message_LendingPoolVTokenInterface_total_debt_of
  | Message_LendingPoolVTokenInterface_transfer_debt_from_to
  | Message_LendingPoolVTokenInterface_user_debt_of
  | Message_LendingPoolView_get_block_timestamp_provider_address
  | Message_LendingPoolView_get_user_free_collateral_coefficient
  | Message_LendingPoolView_view_asset_id
  | Message_LendingPoolView_view_flash_loan_fee_e6
  | Message_LendingPoolView_view_market_rule
  | Message_LendingPoolView_view_protocol_income
  | Message_LendingPoolView_view_registered_assets
  | Message_LendingPoolView_view_reserve_data
  | Message_LendingPoolView_view_reserve_decimal_multiplier
  | Message_LendingPoolView_view_reserve_indexes
  | Message_LendingPoolView_view_reserve_parameters
  | Message_LendingPoolView_view_reserve_restrictions
  | Message_LendingPoolView_view_reserve_tokens
  | Message_LendingPoolView_view_unupdated_reserve_data
  | Message_LendingPoolView_view_unupdated_reserve_indexes
  | Message_LendingPoolView_view_unupdated_user_reserve_data
  | Message_LendingPoolView_view_user_config
  | Message_LendingPoolView_view_user_reserve_data
  | Message_set_code;

export interface Message_AccessControl_get_role_admin {
  __kind: 'AccessControl_get_role_admin';
  role: number;
}

export interface Message_AccessControl_grant_role {
  __kind: 'AccessControl_grant_role';
  role: number;
  account?: AccountId | undefined;
}

export interface Message_AccessControl_has_role {
  __kind: 'AccessControl_has_role';
  role: number;
  address?: AccountId | undefined;
}

export interface Message_AccessControl_renounce_role {
  __kind: 'AccessControl_renounce_role';
  role: number;
  account?: AccountId | undefined;
}

export interface Message_AccessControl_revoke_role {
  __kind: 'AccessControl_revoke_role';
  role: number;
  account?: AccountId | undefined;
}

export interface Message_LendingPoolATokenInterface_total_deposit_of {
  __kind: 'LendingPoolATokenInterface_total_deposit_of';
  underlyingAsset: AccountId;
}

export interface Message_LendingPoolATokenInterface_transfer_deposit_from_to {
  __kind: 'LendingPoolATokenInterface_transfer_deposit_from_to';
  underlyingAsset: AccountId;
  from: AccountId;
  to: AccountId;
  amount: bigint;
}

export interface Message_LendingPoolATokenInterface_user_deposit_of {
  __kind: 'LendingPoolATokenInterface_user_deposit_of';
  underlyingAsset: AccountId;
  user: AccountId;
}

export interface Message_LendingPoolBorrow_borrow {
  __kind: 'LendingPoolBorrow_borrow';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
  data: Vec;
}

export interface Message_LendingPoolBorrow_choose_market_rule {
  __kind: 'LendingPoolBorrow_choose_market_rule';
  marketRuleId: number;
}

export interface Message_LendingPoolBorrow_repay {
  __kind: 'LendingPoolBorrow_repay';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
  data: Vec;
}

export interface Message_LendingPoolBorrow_set_as_collateral {
  __kind: 'LendingPoolBorrow_set_as_collateral';
  asset: AccountId;
  useAsCollateral: bool;
}

export interface Message_LendingPoolDeposit_deposit {
  __kind: 'LendingPoolDeposit_deposit';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
  data: Vec;
}

export interface Message_LendingPoolDeposit_redeem {
  __kind: 'LendingPoolDeposit_redeem';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
  data: Vec;
}

export interface Message_LendingPoolFlash_flash_loan {
  __kind: 'LendingPoolFlash_flash_loan';
  receiverAddress: AccountId;
  assets: AccountId[];
  amounts: bigint[];
  receiverParams: Vec;
}

export interface Message_LendingPoolLiquidate_liquidate {
  __kind: 'LendingPoolLiquidate_liquidate';
  liquidatedUser: AccountId;
  assetToRepay: AccountId;
  assetToTake: AccountId;
  amountToRepay: bigint;
  minimumRecievedForOneRepaidTokenE18: bigint;
  data: Vec;
}

export interface Message_LendingPoolMaintain_accumulate_interest {
  __kind: 'LendingPoolMaintain_accumulate_interest';
  asset: AccountId;
}

export interface Message_LendingPoolManage_add_market_rule {
  __kind: 'LendingPoolManage_add_market_rule';
  marketRule: (AssetRules | undefined)[];
}

export interface Message_LendingPoolManage_modify_asset_rule {
  __kind: 'LendingPoolManage_modify_asset_rule';
  marketRuleId: number;
  asset: AccountId;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
}

export interface Message_LendingPoolManage_register_asset {
  __kind: 'LendingPoolManage_register_asset';
  asset: AccountId;
  aTokenCodeHash: Bytes;
  vTokenCodeHash: Bytes;
  name: string;
  symbol: string;
  decimals: u8;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
  maximalTotalDeposit?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
  incomeForSuppliersPartE6: bigint;
  interestRateModel: bigint[];
}

export interface Message_LendingPoolManage_register_stablecoin {
  __kind: 'LendingPoolManage_register_stablecoin';
  asset: AccountId;
  aTokenCodeHash: Bytes;
  vTokenCodeHash: Bytes;
  name: string;
  symbol: string;
  decimals: u8;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
  maximalTotalDeposit?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
}

export interface Message_LendingPoolManage_set_block_timestamp_provider {
  __kind: 'LendingPoolManage_set_block_timestamp_provider';
  providerAddress: AccountId;
}

export interface Message_LendingPoolManage_set_flash_loan_fee_e6 {
  __kind: 'LendingPoolManage_set_flash_loan_fee_e6';
  flashLoanFeeE6: bigint;
}

export interface Message_LendingPoolManage_set_price_feed_provider {
  __kind: 'LendingPoolManage_set_price_feed_provider';
  priceFeedProvider: AccountId;
}

export interface Message_LendingPoolManage_set_reserve_is_active {
  __kind: 'LendingPoolManage_set_reserve_is_active';
  asset: AccountId;
  active: bool;
}

export interface Message_LendingPoolManage_set_reserve_is_freezed {
  __kind: 'LendingPoolManage_set_reserve_is_freezed';
  asset: AccountId;
  freeze: bool;
}

export interface Message_LendingPoolManage_set_reserve_parameters {
  __kind: 'LendingPoolManage_set_reserve_parameters';
  asset: AccountId;
  interestRateModel: bigint[];
  incomeForSuppliersPartE6: bigint;
}

export interface Message_LendingPoolManage_set_reserve_restrictions {
  __kind: 'LendingPoolManage_set_reserve_restrictions';
  asset: AccountId;
  maximalTotalDeposit?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
}

export interface Message_LendingPoolManage_set_stablecoin_debt_rate_e24 {
  __kind: 'LendingPoolManage_set_stablecoin_debt_rate_e24';
  asset: AccountId;
  debtRateE24: bigint;
}

export interface Message_LendingPoolManage_take_protocol_income {
  __kind: 'LendingPoolManage_take_protocol_income';
  assets?: AccountId[] | undefined;
  to: AccountId;
}

export interface Message_LendingPoolVTokenInterface_total_debt_of {
  __kind: 'LendingPoolVTokenInterface_total_debt_of';
  underlyingAsset: AccountId;
}

export interface Message_LendingPoolVTokenInterface_transfer_debt_from_to {
  __kind: 'LendingPoolVTokenInterface_transfer_debt_from_to';
  underlyingAsset: AccountId;
  from: AccountId;
  to: AccountId;
  amount: bigint;
}

export interface Message_LendingPoolVTokenInterface_user_debt_of {
  __kind: 'LendingPoolVTokenInterface_user_debt_of';
  underlyingAsset: AccountId;
  user: AccountId;
}

export interface Message_LendingPoolView_get_block_timestamp_provider_address {
  __kind: 'LendingPoolView_get_block_timestamp_provider_address';
}

export interface Message_LendingPoolView_get_user_free_collateral_coefficient {
  __kind: 'LendingPoolView_get_user_free_collateral_coefficient';
  userAddress: AccountId;
}

export interface Message_LendingPoolView_view_asset_id {
  __kind: 'LendingPoolView_view_asset_id';
  account: AccountId;
}

export interface Message_LendingPoolView_view_flash_loan_fee_e6 {
  __kind: 'LendingPoolView_view_flash_loan_fee_e6';
}

export interface Message_LendingPoolView_view_market_rule {
  __kind: 'LendingPoolView_view_market_rule';
  marketRuleId: number;
}

export interface Message_LendingPoolView_view_protocol_income {
  __kind: 'LendingPoolView_view_protocol_income';
  assets?: AccountId[] | undefined;
}

export interface Message_LendingPoolView_view_registered_assets {
  __kind: 'LendingPoolView_view_registered_assets';
}

export interface Message_LendingPoolView_view_reserve_data {
  __kind: 'LendingPoolView_view_reserve_data';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_decimal_multiplier {
  __kind: 'LendingPoolView_view_reserve_decimal_multiplier';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_indexes {
  __kind: 'LendingPoolView_view_reserve_indexes';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_parameters {
  __kind: 'LendingPoolView_view_reserve_parameters';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_restrictions {
  __kind: 'LendingPoolView_view_reserve_restrictions';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_tokens {
  __kind: 'LendingPoolView_view_reserve_tokens';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_unupdated_reserve_data {
  __kind: 'LendingPoolView_view_unupdated_reserve_data';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_unupdated_reserve_indexes {
  __kind: 'LendingPoolView_view_unupdated_reserve_indexes';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_unupdated_user_reserve_data {
  __kind: 'LendingPoolView_view_unupdated_user_reserve_data';
  asset: AccountId;
  account: AccountId;
}

export interface Message_LendingPoolView_view_user_config {
  __kind: 'LendingPoolView_view_user_config';
  user: AccountId;
}

export interface Message_LendingPoolView_view_user_reserve_data {
  __kind: 'LendingPoolView_view_user_reserve_data';
  asset: AccountId;
  account: AccountId;
}

export interface Message_set_code {
  __kind: 'set_code';
  codeHash: Bytes;
}

export type u8 = number;

export type String = string;

export type Vec = Bytes;

export type Event =
  | Event_AssetRegistered
  | Event_AssetRulesChanged
  | Event_BorrowVariable
  | Event_CollateralSet
  | Event_Deposit
  | Event_FlashLoan
  | Event_FlashLoanFeeChanged
  | Event_IncomeTaken
  | Event_InterestsAccumulated
  | Event_Liquidation
  | Event_MarketRuleChosen
  | Event_PriceFeedProviderChanged
  | Event_RateRebalanced
  | Event_Redeem
  | Event_RepayVariable
  | Event_ReserveActivated
  | Event_ReserveFreezed
  | Event_ReserveParametersChanged
  | Event_ReserveRestrictionsChanged
  | Event_StablecoinDebtRateChanged
  | Event_UserInterestsAccumulated;

export interface Event_AssetRegistered {
  __kind: 'AssetRegistered';
  asset: AccountId;
  decimals: u8;
  name: string;
  symbol: string;
  aTokenCodeHash: Bytes;
  vTokenCodeHash: Bytes;
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export interface Event_AssetRulesChanged {
  __kind: 'AssetRulesChanged';
  marketRuleId: number;
  asset: AccountId;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
}

export interface Event_BorrowVariable {
  __kind: 'BorrowVariable';
  asset: AccountId;
  caller: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
}

export interface Event_CollateralSet {
  __kind: 'CollateralSet';
  caller: AccountId;
  asset: AccountId;
  set: bool;
}

export interface Event_Deposit {
  __kind: 'Deposit';
  asset: AccountId;
  caller: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
}

export interface Event_FlashLoan {
  __kind: 'FlashLoan';
  receiverAddress: AccountId;
  caller: AccountId;
  asset: AccountId;
  amount: bigint;
  fee: bigint;
}

export interface Event_FlashLoanFeeChanged {
  __kind: 'FlashLoanFeeChanged';
  flashLoanFeeE6: bigint;
}

export interface Event_IncomeTaken {
  __kind: 'IncomeTaken';
  asset: AccountId;
}

export interface Event_InterestsAccumulated {
  __kind: 'InterestsAccumulated';
  asset: AccountId;
}

export interface Event_Liquidation {
  __kind: 'Liquidation';
  liquidator: AccountId;
  user: AccountId;
  assetToRepay: AccountId;
  assetToTake: AccountId;
  amountRepaid: bigint;
  amountTaken: bigint;
}

export interface Event_MarketRuleChosen {
  __kind: 'MarketRuleChosen';
  user: AccountId;
  marketRuleId: number;
}

export interface Event_PriceFeedProviderChanged {
  __kind: 'PriceFeedProviderChanged';
  priceFeedProvider: AccountId;
}

export interface Event_RateRebalanced {
  __kind: 'RateRebalanced';
  asset: AccountId;
  user: AccountId;
}

export interface Event_Redeem {
  __kind: 'Redeem';
  asset: AccountId;
  caller: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
}

export interface Event_RepayVariable {
  __kind: 'RepayVariable';
  asset: AccountId;
  caller: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
}

export interface Event_ReserveActivated {
  __kind: 'ReserveActivated';
  asset: AccountId;
  active: bool;
}

export interface Event_ReserveFreezed {
  __kind: 'ReserveFreezed';
  asset: AccountId;
  freezed: bool;
}

export interface Event_ReserveParametersChanged {
  __kind: 'ReserveParametersChanged';
  asset: AccountId;
  interestRateModel: bigint[];
  incomeForSuppliersPartE6: bigint;
}

export interface Event_ReserveRestrictionsChanged {
  __kind: 'ReserveRestrictionsChanged';
  asset: AccountId;
  maximalTotalDeposit?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
}

export interface Event_StablecoinDebtRateChanged {
  __kind: 'StablecoinDebtRateChanged';
  asset: AccountId;
  debtRateE24: bigint;
}

export interface Event_UserInterestsAccumulated {
  __kind: 'UserInterestsAccumulated';
  asset: AccountId;
  user: AccountId;
}

export type Result<T, E> = { __kind: 'Ok'; value: T } | { __kind: 'Err'; value: E };
