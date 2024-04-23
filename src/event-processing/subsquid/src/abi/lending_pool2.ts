import type { Bytes } from '@subsquid/ink-abi';
import { Abi, encodeCall, decodeResult } from '@subsquid/ink-abi';

export const metadata = {
  source: {
    hash: '0x1cc1510692e5ba708740ac5ae3e7006aa25a528944a81ce998b86367a00af0b8',
    language: 'ink! 4.3.0',
    compiler: 'rustc 1.69.0',
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
        type: 3,
      },
      balance: {
        displayName: ['Balance'],
        type: 10,
      },
      blockNumber: {
        displayName: ['BlockNumber'],
        type: 1,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 1,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'set',
            type: {
              displayName: ['bool'],
              type: 0,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'caller',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'fee',
            type: {
              displayName: ['u128'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset_to_repay',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset_to_take',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount_repaid',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount_taken',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 3,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'decimals',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'a_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'v_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['u128'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'active',
            type: {
              displayName: ['bool'],
              type: 0,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'freezed',
            type: {
              displayName: ['bool'],
              type: 0,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'interest_rate_model',
            type: {
              displayName: [],
              type: 30,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 10,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'maximal_total_supply',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 1,
            },
          },
          {
            docs: [],
            indexed: true,
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 9,
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
              type: 3,
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
              type: 3,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'debt_rate_e24',
            type: {
              displayName: ['u128'],
              type: 10,
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
        args: [],
        default: false,
        docs: [],
        label: 'pause',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x81e0c604',
      },
      {
        args: [],
        default: false,
        docs: [],
        label: 'unpause',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x67616649',
      },
      {
        args: [
          {
            label: 'code_hash',
            type: {
              displayName: [],
              type: 4,
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
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 22,
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
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 22,
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
          type: 23,
        },
        selector: '0x97a42fe1',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 1,
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
              type: 3,
            },
          },
          {
            label: 'use_as_collateral',
            type: {
              displayName: ['bool'],
              type: 0,
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
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 22,
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
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 22,
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
          type: 23,
        },
        selector: '0xde645a1e',
      },
      {
        args: [
          {
            label: 'receiver_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'assets',
            type: {
              displayName: ['Vec'],
              type: 25,
            },
          },
          {
            label: 'amounts',
            type: {
              displayName: ['Vec'],
              type: 26,
            },
          },
          {
            label: 'receiver_params',
            type: {
              displayName: ['Vec'],
              type: 22,
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
              type: 3,
            },
          },
          {
            label: 'asset_to_repay',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'asset_to_take',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount_to_repay',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'minimum_recieved_for_one_repaid_token_e18',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['Vec'],
              type: 22,
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
          type: 27,
        },
        selector: '0x6d61b4a5',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'price_e8',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolMaintain::insert_reserve_token_price_e8',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 14,
        },
        selector: '0x42dc15bf',
      },
      {
        args: [
          {
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['u128'],
              type: 10,
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
              type: 3,
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
              type: 3,
            },
          },
          {
            label: 'decimals',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'maximal_total_supply',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
          {
            label: 'interest_rate_model',
            type: {
              displayName: [],
              type: 30,
            },
          },
          {
            label: 'a_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'v_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
              type: 3,
            },
          },
          {
            label: 'decimals',
            type: {
              displayName: ['u128'],
              type: 10,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'maximal_total_supply',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'a_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'v_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
              type: 3,
            },
          },
          {
            label: 'active',
            type: {
              displayName: ['bool'],
              type: 0,
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
              type: 3,
            },
          },
          {
            label: 'freeze',
            type: {
              displayName: ['bool'],
              type: 0,
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
              type: 3,
            },
          },
          {
            label: 'interest_rate_model',
            type: {
              displayName: [],
              type: 30,
            },
          },
          {
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 10,
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
              type: 3,
            },
          },
          {
            label: 'maximal_total_supply',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 10,
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
              type: 6,
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
              type: 1,
            },
          },
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 9,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 9,
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
              type: 31,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 32,
        },
        selector: '0x01144880',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'debt_rate_e24',
            type: {
              displayName: ['u128'],
              type: 10,
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
          type: 37,
        },
        selector: '0x03acc819',
      },
      {
        args: [
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 38,
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
          type: 40,
        },
        selector: '0x7ee520ac',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 41,
        },
        selector: '0x1eea06d8',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 41,
        },
        selector: '0xc4adf4e3',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 44,
        },
        selector: '0x2b038385',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 47,
        },
        selector: '0xd71538f5',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 50,
        },
        selector: '0xe27ee044',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 53,
        },
        selector: '0x6ea8d1e8',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::view_reserve_prices',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 56,
        },
        selector: '0xa2defa44',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 44,
        },
        selector: '0xd179c3bb',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 59,
        },
        selector: '0xb9dff1c2',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 59,
        },
        selector: '0xbf86b805',
      },
      {
        args: [
          {
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 61,
        },
        selector: '0xe6ef16de',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['RuleId'],
              type: 1,
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
          type: 63,
        },
        selector: '0x5e701ec3',
      },
      {
        args: [
          {
            label: 'user_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
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
          type: 65,
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
          type: 67,
        },
        selector: '0xe598e179',
      },
      {
        args: [
          {
            label: 'reserve_token_address',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolView::get_reserve_token_price_e8',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 68,
        },
        selector: '0x504a5adc',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['Option'],
              type: 31,
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
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolATokenInterface::total_supply_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 37,
        },
        selector: '0xed264227',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolATokenInterface::user_supply_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 37,
        },
        selector: '0x346bd340',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'from',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolATokenInterface::transfer_supply_from_to',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 27,
        },
        selector: '0xacd47ab2',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolVTokenInterface::total_variable_debt_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 37,
        },
        selector: '0x1f202294',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'user',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolVTokenInterface::user_variable_debt_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 37,
        },
        selector: '0x89a85a08',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'from',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['AccountId'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['Balance'],
              type: 10,
            },
          },
        ],
        default: false,
        docs: [],
        label: 'LendingPoolVTokenInterface::transfer_variable_debt_from_to',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 27,
        },
        selector: '0x3356028c',
      },
      {
        args: [],
        default: false,
        docs: [],
        label: 'Pausable::paused',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 70,
        },
        selector: '0xd123ce11',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 1,
            },
          },
          {
            label: 'address',
            type: {
              displayName: ['Option'],
              type: 71,
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
          type: 70,
        },
        selector: '0xc1d9ac18',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['RoleType'],
              type: 1,
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
              type: 1,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['Option'],
              type: 71,
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
              type: 1,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['Option'],
              type: 71,
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
              type: 1,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['Option'],
              type: 71,
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
                              key: '0xb2888d9d',
                              ty: 0,
                            },
                          },
                          root_key: '0xb2888d9d',
                        },
                      },
                      name: 'paused',
                    },
                  ],
                  name: 'Data',
                },
              },
              name: 'pause',
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
                              key: '0xe9211bfd',
                              ty: 1,
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
                              ty: 2,
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
                              ty: 3,
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
                              key: '0x5776e292',
                              ty: 1,
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
                              ty: 1,
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
                              ty: 3,
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
                              ty: 1,
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
                              ty: 6,
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
                                      key: '0xdf6a6272',
                                      ty: 3,
                                    },
                                  },
                                  name: 'a_token_address',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xdf6a6272',
                                      ty: 3,
                                    },
                                  },
                                  name: 'v_token_address',
                                },
                              ],
                              name: 'ReserveAbacusTokens',
                            },
                          },
                          root_key: '0xdf6a6272',
                        },
                      },
                      name: 'reserve_abacus',
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
                                                  ty: 10,
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
                                  name: 'maximal_total_supply',
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
                                                  ty: 10,
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
                                      ty: 10,
                                    },
                                  },
                                  name: 'minimal_collateral',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xe19bbd17',
                                      ty: 10,
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
                                      ty: 10,
                                    },
                                  },
                                  name: 'cumulative_supply_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xd075ddd3',
                                      ty: 10,
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
                            struct: {
                              fields: [
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xa60dfd30',
                                      ty: 10,
                                    },
                                  },
                                  name: 'decimals',
                                },
                                {
                                  layout: {
                                    enum: {
                                      dispatchKey: '0xa60dfd30',
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
                                                  key: '0xa60dfd30',
                                                  ty: 10,
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
                                  name: 'token_price_e8',
                                },
                              ],
                              name: 'ReservePrice',
                            },
                          },
                          root_key: '0xa60dfd30',
                        },
                      },
                      name: 'reserve_prices',
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
                                      ty: 0,
                                    },
                                  },
                                  name: 'activated',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 0,
                                    },
                                  },
                                  name: 'freezed',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 10,
                                    },
                                  },
                                  name: 'total_deposit',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 10,
                                    },
                                  },
                                  name: 'current_supply_rate_e24',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 10,
                                    },
                                  },
                                  name: 'total_debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x79bca6dd',
                                      ty: 10,
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
                                          ty: 10,
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
                                      ty: 10,
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
                                      ty: 10,
                                    },
                                  },
                                  name: 'deposit',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 10,
                                    },
                                  },
                                  name: 'debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 10,
                                    },
                                  },
                                  name: 'applied_cumulative_supply_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x207f5774',
                                      ty: 10,
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
                                      ty: 10,
                                    },
                                  },
                                  name: 'deposits',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 10,
                                    },
                                  },
                                  name: 'collaterals',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 10,
                                    },
                                  },
                                  name: 'borrows',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x292a3168',
                                      ty: 1,
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
                              ty: 10,
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
          primitive: 'bool',
        },
      },
    },
    {
      id: 1,
      type: {
        def: {
          primitive: 'u32',
        },
      },
    },
    {
      id: 2,
      type: {
        def: {
          tuple: [],
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 4,
                typeName: '[u8; 32]',
              },
            ],
          },
        },
        path: ['ink_primitives', 'types', 'AccountId'],
      },
    },
    {
      id: 4,
      type: {
        def: {
          array: {
            len: 32,
            type: 5,
          },
        },
      },
    },
    {
      id: 5,
      type: {
        def: {
          primitive: 'u8',
        },
      },
    },
    {
      id: 6,
      type: {
        def: {
          sequence: {
            type: 7,
          },
        },
      },
    },
    {
      id: 7,
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
                    type: 8,
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
            type: 8,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 8,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'collateral_coefficient_e6',
                type: 9,
                typeName: 'Option<u128>',
              },
              {
                name: 'borrow_coefficient_e6',
                type: 9,
                typeName: 'Option<u128>',
              },
              {
                name: 'penalty_e6',
                type: 9,
                typeName: 'Option<u128>',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'asset_rules', 'AssetRules'],
      },
    },
    {
      id: 9,
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
                    type: 10,
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
            type: 10,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 10,
      type: {
        def: {
          primitive: 'u128',
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
                    type: 2,
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
            type: 2,
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
                    typeName: 'FlashLoanReceiverError',
                  },
                ],
                index: 0,
                name: 'FlashLoanReceiverError',
              },
              {
                fields: [
                  {
                    type: 19,
                    typeName: 'AccessControlError',
                  },
                ],
                index: 1,
                name: 'AccessControlError',
              },
              {
                fields: [
                  {
                    type: 20,
                    typeName: 'PausableError',
                  },
                ],
                index: 2,
                name: 'PausableError',
              },
              {
                fields: [
                  {
                    type: 21,
                    typeName: 'MathError',
                  },
                ],
                index: 3,
                name: 'MathError',
              },
              {
                index: 4,
                name: 'Inactive',
              },
              {
                index: 5,
                name: 'AlreadySet',
              },
              {
                index: 6,
                name: 'Freezed',
              },
              {
                index: 7,
                name: 'AlreadyRegistered',
              },
              {
                index: 8,
                name: 'AssetNotRegistered',
              },
              {
                index: 9,
                name: 'AssetIsProtocolStablecoin',
              },
              {
                index: 10,
                name: 'RuleBorrowDisable',
              },
              {
                index: 11,
                name: 'RuleCollateralDisable',
              },
              {
                index: 12,
                name: 'InsufficientCollateral',
              },
              {
                index: 13,
                name: 'MinimalCollateralDeposit',
              },
              {
                index: 14,
                name: 'MinimalDebt',
              },
              {
                index: 15,
                name: 'InsufficientDebt',
              },
              {
                index: 16,
                name: 'Collaterized',
              },
              {
                index: 17,
                name: 'InsufficientDeposit',
              },
              {
                index: 18,
                name: 'MinimumRecieved',
              },
              {
                index: 19,
                name: 'AmountNotGreaterThanZero',
              },
              {
                index: 20,
                name: 'AssetPriceNotInitialized',
              },
              {
                index: 21,
                name: 'NothingToRepay',
              },
              {
                index: 22,
                name: 'NothingToCompensateWith',
              },
              {
                index: 23,
                name: 'RepayingWithACollateral',
              },
              {
                index: 24,
                name: 'TakingNotACollateral',
              },
              {
                index: 25,
                name: 'FlashLoanAmountsAssetsInconsistentLengths',
              },
              {
                index: 26,
                name: 'MaxSupplyReached',
              },
              {
                index: 27,
                name: 'MaxDebtReached',
              },
              {
                index: 28,
                name: 'MarketRuleInvalidAssetId',
              },
              {
                index: 29,
                name: 'MarketRuleInvalidId',
              },
              {
                index: 30,
                name: 'MarketRulePenaltyNotSet',
              },
              {
                index: 31,
                name: 'PriceMissing',
              },
              {
                index: 32,
                name: 'AccumulatedAlready',
              },
              {
                index: 33,
                name: 'PSP22Error',
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
                name: 'ExecuteOperationFailed',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'flash_loan_receiver', 'FlashLoanReceiverError'],
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
      id: 20,
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
      id: 21,
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
      id: 22,
      type: {
        def: {
          sequence: {
            type: 5,
          },
        },
      },
    },
    {
      id: 23,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 24,
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
            type: 24,
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
      id: 24,
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
            type: 10,
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
      id: 25,
      type: {
        def: {
          sequence: {
            type: 3,
          },
        },
      },
    },
    {
      id: 26,
      type: {
        def: {
          sequence: {
            type: 10,
          },
        },
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
      id: 28,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 29,
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
            type: 29,
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
      id: 29,
      type: {
        def: {
          tuple: [10, 10],
        },
      },
    },
    {
      id: 30,
      type: {
        def: {
          array: {
            len: 7,
            type: 10,
          },
        },
      },
    },
    {
      id: 31,
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
                    type: 25,
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
            type: 25,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 32,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 33,
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
            type: 33,
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
      id: 33,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 34,
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
            type: 34,
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
      id: 34,
      type: {
        def: {
          sequence: {
            type: 35,
          },
        },
      },
    },
    {
      id: 35,
      type: {
        def: {
          tuple: [3, 36],
        },
      },
    },
    {
      id: 36,
      type: {
        def: {
          primitive: 'i128',
        },
      },
    },
    {
      id: 37,
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
      id: 38,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 39,
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
            type: 39,
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
      id: 39,
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
                    type: 1,
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
            type: 1,
          },
        ],
        path: ['Option'],
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
                    type: 25,
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
            type: 25,
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
                    type: 43,
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
            type: 43,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 43,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'activated',
                type: 0,
                typeName: 'bool',
              },
              {
                name: 'freezed',
                type: 0,
                typeName: 'bool',
              },
              {
                name: 'total_deposit',
                type: 10,
                typeName: 'Balance',
              },
              {
                name: 'current_supply_rate_e24',
                type: 10,
                typeName: 'u128',
              },
              {
                name: 'total_debt',
                type: 10,
                typeName: 'Balance',
              },
              {
                name: 'current_debt_rate_e24',
                type: 10,
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
                name: 'cumulative_supply_index_e18',
                type: 10,
                typeName: 'u128',
              },
              {
                name: 'cumulative_debt_index_e18',
                type: 10,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveIndexes'],
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
                name: 'interest_rate_model',
                type: 30,
                typeName: '[u128; 7]',
              },
              {
                name: 'income_for_suppliers_part_e6',
                type: 10,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveParameters'],
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
                name: 'maximal_total_supply',
                type: 9,
                typeName: 'Option<Balance>',
              },
              {
                name: 'maximal_total_debt',
                type: 9,
                typeName: 'Option<Balance>',
              },
              {
                name: 'minimal_collateral',
                type: 10,
                typeName: 'Balance',
              },
              {
                name: 'minimal_debt',
                type: 10,
                typeName: 'Balance',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveRestrictions'],
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
                name: 'a_token_address',
                type: 3,
                typeName: 'AccountId',
              },
              {
                name: 'v_token_address',
                type: 3,
                typeName: 'AccountId',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveAbacusTokens'],
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
                name: 'decimals',
                type: 10,
                typeName: 'u128',
              },
              {
                name: 'token_price_e8',
                type: 9,
                typeName: 'Option<u128>',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReservePrice'],
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
                    type: 60,
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
            type: 60,
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
          composite: {
            fields: [
              {
                name: 'deposit',
                type: 10,
                typeName: 'Balance',
              },
              {
                name: 'debt',
                type: 10,
                typeName: 'Balance',
              },
              {
                name: 'applied_cumulative_supply_index_e18',
                type: 10,
                typeName: 'u128',
              },
              {
                name: 'applied_cumulative_debt_index_e18',
                type: 10,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'user_reserve_data', 'UserReserveData'],
      },
    },
    {
      id: 61,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 62,
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
            type: 62,
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
      id: 62,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'deposits',
                type: 10,
                typeName: 'Bitmap128',
              },
              {
                name: 'collaterals',
                type: 10,
                typeName: 'Bitmap128',
              },
              {
                name: 'borrows',
                type: 10,
                typeName: 'Bitmap128',
              },
              {
                name: 'market_rule_id',
                type: 1,
                typeName: 'u32',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'user_config', 'UserConfig'],
      },
    },
    {
      id: 63,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 64,
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
            type: 64,
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
      id: 64,
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
                    type: 6,
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
            type: 6,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 65,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 66,
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
            type: 66,
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
      id: 66,
      type: {
        def: {
          tuple: [0, 10],
        },
      },
    },
    {
      id: 67,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 3,
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
            type: 3,
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
      id: 68,
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
      id: 69,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 34,
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
            type: 34,
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
      id: 71,
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
                    type: 3,
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
            type: 3,
          },
        ],
        path: ['Option'],
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
                    type: 2,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 19,
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
            type: 19,
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
                type: 4,
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

  LendingPoolView_view_reserve_prices(asset: AccountId): Promise<Result<ReservePrice | undefined, LangError>> {
    return this.stateCall('0xa2defa44', [asset]);
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

  LendingPoolView_get_reserve_token_price_e8(reserve_token_address: AccountId): Promise<Result<bigint | undefined, LangError>> {
    return this.stateCall('0x504a5adc', [reserve_token_address]);
  }

  LendingPoolView_view_protocol_income(assets: AccountId[] | undefined): Promise<Result<[AccountId, bigint][], LangError>> {
    return this.stateCall('0xa6121b9f', [assets]);
  }

  LendingPoolATokenInterface_total_supply_of(underlying_asset: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0xed264227', [underlying_asset]);
  }

  LendingPoolATokenInterface_user_supply_of(underlying_asset: AccountId, user: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x346bd340', [underlying_asset, user]);
  }

  LendingPoolVTokenInterface_total_variable_debt_of(underlying_asset: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x1f202294', [underlying_asset]);
  }

  LendingPoolVTokenInterface_user_variable_debt_of(underlying_asset: AccountId, user: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x89a85a08', [underlying_asset, user]);
  }

  Pausable_paused(): Promise<Result<bool, LangError>> {
    return this.stateCall('0xd123ce11', []);
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
  appliedCumulativeSupplyIndexE18: bigint;
  appliedCumulativeDebtIndexE18: bigint;
}

export interface ReservePrice {
  decimals: bigint;
  tokenPriceE8?: bigint | undefined;
}

export interface ReserveAbacusTokens {
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export interface ReserveRestrictions {
  maximalTotalSupply?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
}

export interface ReserveParameters {
  interestRateModel: bigint[];
  incomeForSuppliersPartE6: bigint;
}

export interface ReserveIndexes {
  cumulativeSupplyIndexE18: bigint;
  cumulativeDebtIndexE18: bigint;
}

export interface ReserveData {
  activated: bool;
  freezed: bool;
  totalDeposit: bigint;
  currentSupplyRateE24: bigint;
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
  | Message_LendingPoolATokenInterface_total_supply_of
  | Message_LendingPoolATokenInterface_transfer_supply_from_to
  | Message_LendingPoolATokenInterface_user_supply_of
  | Message_LendingPoolBorrow_borrow
  | Message_LendingPoolBorrow_choose_market_rule
  | Message_LendingPoolBorrow_repay
  | Message_LendingPoolBorrow_set_as_collateral
  | Message_LendingPoolDeposit_deposit
  | Message_LendingPoolDeposit_redeem
  | Message_LendingPoolFlash_flash_loan
  | Message_LendingPoolLiquidate_liquidate
  | Message_LendingPoolMaintain_accumulate_interest
  | Message_LendingPoolMaintain_insert_reserve_token_price_e8
  | Message_LendingPoolManage_add_market_rule
  | Message_LendingPoolManage_modify_asset_rule
  | Message_LendingPoolManage_register_asset
  | Message_LendingPoolManage_register_stablecoin
  | Message_LendingPoolManage_set_block_timestamp_provider
  | Message_LendingPoolManage_set_flash_loan_fee_e6
  | Message_LendingPoolManage_set_reserve_is_active
  | Message_LendingPoolManage_set_reserve_is_freezed
  | Message_LendingPoolManage_set_reserve_parameters
  | Message_LendingPoolManage_set_reserve_restrictions
  | Message_LendingPoolManage_set_stablecoin_debt_rate_e24
  | Message_LendingPoolManage_take_protocol_income
  | Message_LendingPoolVTokenInterface_total_variable_debt_of
  | Message_LendingPoolVTokenInterface_transfer_variable_debt_from_to
  | Message_LendingPoolVTokenInterface_user_variable_debt_of
  | Message_LendingPoolView_get_block_timestamp_provider_address
  | Message_LendingPoolView_get_reserve_token_price_e8
  | Message_LendingPoolView_get_user_free_collateral_coefficient
  | Message_LendingPoolView_view_asset_id
  | Message_LendingPoolView_view_flash_loan_fee_e6
  | Message_LendingPoolView_view_market_rule
  | Message_LendingPoolView_view_protocol_income
  | Message_LendingPoolView_view_registered_assets
  | Message_LendingPoolView_view_reserve_data
  | Message_LendingPoolView_view_reserve_indexes
  | Message_LendingPoolView_view_reserve_parameters
  | Message_LendingPoolView_view_reserve_prices
  | Message_LendingPoolView_view_reserve_restrictions
  | Message_LendingPoolView_view_reserve_tokens
  | Message_LendingPoolView_view_unupdated_reserve_data
  | Message_LendingPoolView_view_unupdated_reserve_indexes
  | Message_LendingPoolView_view_unupdated_user_reserve_data
  | Message_LendingPoolView_view_user_config
  | Message_LendingPoolView_view_user_reserve_data
  | Message_Pausable_paused
  | Message_pause
  | Message_set_code
  | Message_unpause;

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

export interface Message_LendingPoolATokenInterface_total_supply_of {
  __kind: 'LendingPoolATokenInterface_total_supply_of';
  underlyingAsset: AccountId;
}

export interface Message_LendingPoolATokenInterface_transfer_supply_from_to {
  __kind: 'LendingPoolATokenInterface_transfer_supply_from_to';
  underlyingAsset: AccountId;
  from: AccountId;
  to: AccountId;
  amount: bigint;
}

export interface Message_LendingPoolATokenInterface_user_supply_of {
  __kind: 'LendingPoolATokenInterface_user_supply_of';
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

export interface Message_LendingPoolMaintain_insert_reserve_token_price_e8 {
  __kind: 'LendingPoolMaintain_insert_reserve_token_price_e8';
  asset: AccountId;
  priceE8: bigint;
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
  decimals: bigint;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
  maximalTotalSupply?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
  incomeForSuppliersPartE6: bigint;
  interestRateModel: bigint[];
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export interface Message_LendingPoolManage_register_stablecoin {
  __kind: 'LendingPoolManage_register_stablecoin';
  asset: AccountId;
  decimals: bigint;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
  maximalTotalSupply?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export interface Message_LendingPoolManage_set_block_timestamp_provider {
  __kind: 'LendingPoolManage_set_block_timestamp_provider';
  providerAddress: AccountId;
}

export interface Message_LendingPoolManage_set_flash_loan_fee_e6 {
  __kind: 'LendingPoolManage_set_flash_loan_fee_e6';
  flashLoanFeeE6: bigint;
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
  maximalTotalSupply?: bigint | undefined;
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

export interface Message_LendingPoolVTokenInterface_total_variable_debt_of {
  __kind: 'LendingPoolVTokenInterface_total_variable_debt_of';
  underlyingAsset: AccountId;
}

export interface Message_LendingPoolVTokenInterface_transfer_variable_debt_from_to {
  __kind: 'LendingPoolVTokenInterface_transfer_variable_debt_from_to';
  underlyingAsset: AccountId;
  from: AccountId;
  to: AccountId;
  amount: bigint;
}

export interface Message_LendingPoolVTokenInterface_user_variable_debt_of {
  __kind: 'LendingPoolVTokenInterface_user_variable_debt_of';
  underlyingAsset: AccountId;
  user: AccountId;
}

export interface Message_LendingPoolView_get_block_timestamp_provider_address {
  __kind: 'LendingPoolView_get_block_timestamp_provider_address';
}

export interface Message_LendingPoolView_get_reserve_token_price_e8 {
  __kind: 'LendingPoolView_get_reserve_token_price_e8';
  reserveTokenAddress: AccountId;
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

export interface Message_LendingPoolView_view_reserve_indexes {
  __kind: 'LendingPoolView_view_reserve_indexes';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_parameters {
  __kind: 'LendingPoolView_view_reserve_parameters';
  asset: AccountId;
}

export interface Message_LendingPoolView_view_reserve_prices {
  __kind: 'LendingPoolView_view_reserve_prices';
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

export interface Message_Pausable_paused {
  __kind: 'Pausable_paused';
}

export interface Message_pause {
  __kind: 'pause';
}

export interface Message_set_code {
  __kind: 'set_code';
  codeHash: Bytes;
}

export interface Message_unpause {
  __kind: 'unpause';
}

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
  decimals: bigint;
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
  maximalTotalSupply?: bigint | undefined;
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
