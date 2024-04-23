import type { Bytes } from '@subsquid/ink-abi';
import { Abi, encodeCall, decodeResult } from '@subsquid/ink-abi';

export const metadata = {
  source: {
    hash: '0xf250c27f2d883dcf92a3c9c3777a50170432f89e4ee11672021e0e53e7d60790',
    language: 'ink! 4.0.0',
    compiler: 'rustc 1.69.0-nightly',
    build_info: {
      build_mode: 'Debug',
      cargo_contract_version: '2.0.1',
      rust_toolchain: 'nightly-x86_64-unknown-linux-gnu',
      wasm_opt_settings: {
        keep_debug_symbols: false,
        optimization_passes: 'Z',
      },
    },
  },
  contract: {
    name: 'lending_pool',
    version: '0.1.0',
    authors: ['Konrad Wierzbik <konrad.wierzbik@gmail.com>'],
  },
  spec: {
    constructors: [
      {
        args: [],
        docs: [],
        label: 'new',
        payable: false,
        returnType: {
          displayName: ['ink_primitives', 'ConstructorResult'],
          type: 13,
        },
        selector: '0x9bae9d5e',
      },
    ],
    docs: [],
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
              type: 11,
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
              type: 11,
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
              displayName: ['u64'],
              type: 12,
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
              type: 11,
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
              type: 11,
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
              type: 11,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'fee',
            type: {
              displayName: ['u128'],
              type: 11,
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
            indexed: true,
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
            label: 'asset_to_rapay',
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
              type: 11,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'amount_taken',
            type: {
              displayName: ['Balance'],
              type: 11,
            },
          },
        ],
        docs: [],
        label: 'LiquidateVariable',
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
              type: 11,
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
              type: 35,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'maximal_total_supply',
            type: {
              displayName: ['Option'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'maximal_total_debt',
            type: {
              displayName: ['Option'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'minimal_collateral',
            type: {
              displayName: ['Balance'],
              type: 11,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'minimal_debt',
            type: {
              displayName: ['Balance'],
              type: 11,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['u128'],
              type: 11,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['u128'],
              type: 11,
            },
          },
        ],
        docs: [],
        label: 'ParametersChanged',
      },
      {
        args: [
          {
            docs: [],
            indexed: true,
            label: 'market_rule_id',
            type: {
              displayName: ['u64'],
              type: 12,
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
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['Option'],
              type: 10,
            },
          },
          {
            docs: [],
            indexed: false,
            label: 'penalty_e6',
            type: {
              displayName: ['Option'],
              type: 10,
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
    ],
    lang_error: {
      displayName: ['ink', 'LangError'],
      type: 14,
    },
    messages: [
      {
        args: [],
        docs: [],
        label: 'pause',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x81e0c604',
      },
      {
        args: [],
        docs: [],
        label: 'unpause',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x67616649',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['accesscontrol_external', 'GetRoleAdminInput1'],
              type: 2,
            },
          },
        ],
        docs: [' Returns the admin role that controls `role`. See `grant_role` and `revoke_role`.'],
        label: 'AccessControl::get_role_admin',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 25,
        },
        selector: '0x83da3bb2',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['accesscontrol_external', 'GrantRoleInput1'],
              type: 2,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['accesscontrol_external', 'GrantRoleInput2'],
              type: 3,
            },
          },
        ],
        docs: [
          ' Grants `role` to `account`.',
          '',
          ' On success a `RoleGranted` event is emitted.',
          '',
          ' # Errors',
          '',
          " Returns with `MissingRole` error if caller can't grant the role.",
          ' Returns with `RoleRedundant` error `account` has `role`.',
        ],
        label: 'AccessControl::grant_role',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 26,
        },
        selector: '0x4ac062fd',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['accesscontrol_external', 'HasRoleInput1'],
              type: 2,
            },
          },
          {
            label: 'address',
            type: {
              displayName: ['accesscontrol_external', 'HasRoleInput2'],
              type: 3,
            },
          },
        ],
        docs: [' Returns `true` if `account` has been granted `role`.'],
        label: 'AccessControl::has_role',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 28,
        },
        selector: '0xc1d9ac18',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['accesscontrol_external', 'RenounceRoleInput1'],
              type: 2,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['accesscontrol_external', 'RenounceRoleInput2'],
              type: 3,
            },
          },
        ],
        docs: [
          ' Revokes `role` from the calling account.',
          " Roles are often managed via `grant_role` and `revoke_role`: this function's",
          ' purpose is to provide a mechanism for accounts to lose their privileges',
          ' if they are compromised (such as when a trusted device is misplaced).',
          '',
          ' On success a `RoleRevoked` event is emitted.',
          '',
          ' # Errors',
          '',
          ' Returns with `InvalidCaller` error if caller is not `account`.',
          " Returns with `MissingRole` error if `account` doesn't have `role`.",
        ],
        label: 'AccessControl::renounce_role',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 26,
        },
        selector: '0xeaf1248a',
      },
      {
        args: [
          {
            label: 'role',
            type: {
              displayName: ['accesscontrol_external', 'RevokeRoleInput1'],
              type: 2,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['accesscontrol_external', 'RevokeRoleInput2'],
              type: 3,
            },
          },
        ],
        docs: [
          ' Revokes `role` from `account`.',
          '',
          ' On success a `RoleRevoked` event is emitted.',
          '',
          ' # Errors',
          '',
          " Returns with `MissingRole` error if caller can't grant the `role` or if `account` doesn't have `role`.",
        ],
        label: 'AccessControl::revoke_role',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 26,
        },
        selector: '0x6e4f0991',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpooldeposit_external', 'RedeemInput1'],
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['lendingpooldeposit_external', 'RedeemInput2'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['lendingpooldeposit_external', 'RedeemInput3'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['lendingpooldeposit_external', 'RedeemInput4'],
              type: 19,
            },
          },
        ],
        docs: [
          ' is used by a user0, to redeem on an account of on_behalf_of an asset to LendingPool.',
          " Redeem can fail if the user has current debt and redeeming would make the user's position undercollateralized.",
          '',
          ' * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.',
          ' * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who',
          '     user0 is making redeem. If user0 != user1 then the allowance of on appropriate AToken will be decreased.',
          ' * `amount` - the number of tokens to be redeemed in Some absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000) or None to redeem all.',
          ' * `data` - additional data that is currently unused. In the future it could for example specify some additional data to be passed during PSP22::transfer_from',
        ],
        label: 'LendingPoolDeposit::redeem',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 29,
        },
        selector: '0x97a42fe1',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpooldeposit_external', 'DepositInput1'],
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['lendingpooldeposit_external', 'DepositInput2'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['lendingpooldeposit_external', 'DepositInput3'],
              type: 11,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['lendingpooldeposit_external', 'DepositInput4'],
              type: 19,
            },
          },
        ],
        docs: [
          ' is used by a user0, to deposit on an account of on_behalf_of an asset to LendingPool.',
          ' Then, within the possibilities, a deposit can be marked as collateral and used to back a loan.',
          '',
          ' * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.',
          ' * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who',
          '     user0 is making a deposit.',
          ' * `amount` - the number of tokens to be deposited in an absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000).',
          ' * `data` - additional data that is currently unused. In the future it could for example specify some additional data to be passed during PSP22::transfer_from',
        ],
        label: 'LendingPoolDeposit::deposit',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xc9dd3a65',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolborrow_external', 'SetAsCollateralInput1'],
              type: 3,
            },
          },
          {
            label: 'use_as_collateral',
            type: {
              displayName: ['lendingpoolborrow_external', 'SetAsCollateralInput2'],
              type: 0,
            },
          },
        ],
        docs: [
          ' is used by a user to choose to use or not a given asset as a collateral',
          " i.e. if the user's deposit of this concrete asset should back his debt and be vulnerable to liquidation.",
          '',
          ' * `asset` - AccountId (aka address) of PSP22 that must be allowed to be collateral.',
          ' * `use_as_collateral` - true if the user wants to use the asset as collateral, false in the opposite case.',
        ],
        label: 'LendingPoolBorrow::set_as_collateral',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xec3848d8',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['lendingpoolborrow_external', 'ChooseMarketRuleInput1'],
              type: 12,
            },
          },
        ],
        docs: [
          ' is used by user to chose a market rule user want to use.',
          ' After changing the chosen market rule users position should be collaterized',
          '',
          ' * `market_rule_id` - the id of the market_rule to use.',
        ],
        label: 'LendingPoolBorrow::choose_market_rule',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xc92e73af',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolborrow_external', 'BorrowInput1'],
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['lendingpoolborrow_external', 'BorrowInput2'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['lendingpoolborrow_external', 'BorrowInput3'],
              type: 11,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['lendingpoolborrow_external', 'BorrowInput4'],
              type: 19,
            },
          },
        ],
        docs: [
          ' is used by a user0, once he made a deposit and chosen users collaterals, to borrow an asset from LendingPool.',
          ' user0 can specify a Variable or Stable borrow rate by passing 0 or 1 in data\\[0\\].',
          '',
          '',
          ' * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.',
          ' * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who',
          '     user1 is making borrow. In case user0 != user1 the allowance on appropriate VToken or SToken will be decreased.',
          ' * `amount` - the number of tokens to be borrowed in absolute value (1 USDT = 1_000_000, 1 AZERO = 1_000_000_000_000).',
          ' * `data` - additional data to specify borrow options. Right now it is only used to specify Variable or Stable borrow rates.',
        ],
        label: 'LendingPoolBorrow::borrow',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xdd556dad',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolborrow_external', 'RepayInput1'],
              type: 3,
            },
          },
          {
            label: 'on_behalf_of',
            type: {
              displayName: ['lendingpoolborrow_external', 'RepayInput2'],
              type: 3,
            },
          },
          {
            label: 'amount_arg',
            type: {
              displayName: ['lendingpoolborrow_external', 'RepayInput3'],
              type: 10,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['lendingpoolborrow_external', 'RepayInput4'],
              type: 19,
            },
          },
        ],
        docs: [
          ' is used by a user0, once he made a borrow, to repay a debt taken in the asset from LendingPool.',
          ' user0 can specify a Variable or Stable debt to repay by passing 0 or 1 in data\\[0\\].',
          '',
          '',
          ' * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.',
          ' * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who',
          '     user1 is making borrow. In case user0 != user1 the allowance on appropriate VToken or SToken will be decreased.',
          ' * `amount_arg` - the number of tokens to be repaid. Pass None to repay all debt or Some in absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000).',
          ' * `data` - additional data to specify repayment options. Right now it is only used to specify Variable or Stable borrow rates.',
        ],
        label: 'LendingPoolBorrow::repay',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 29,
        },
        selector: '0xde645a1e',
      },
      {
        args: [
          {
            label: 'receiver_address',
            type: {
              displayName: ['lendingpoolflash_external', 'FlashLoanInput1'],
              type: 3,
            },
          },
          {
            label: 'assets',
            type: {
              displayName: ['lendingpoolflash_external', 'FlashLoanInput2'],
              type: 6,
            },
          },
          {
            label: 'amounts',
            type: {
              displayName: ['lendingpoolflash_external', 'FlashLoanInput3'],
              type: 31,
            },
          },
          {
            label: 'receiver_params',
            type: {
              displayName: ['lendingpoolflash_external', 'FlashLoanInput4'],
              type: 19,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolFlash::flash_loan',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x81b31ee7',
      },
      {
        args: [
          {
            label: 'liquidated_user',
            type: {
              displayName: ['lendingpoolliquidate_external', 'LiquidateInput1'],
              type: 3,
            },
          },
          {
            label: 'asset_to_repay',
            type: {
              displayName: ['lendingpoolliquidate_external', 'LiquidateInput2'],
              type: 3,
            },
          },
          {
            label: 'asset_to_take',
            type: {
              displayName: ['lendingpoolliquidate_external', 'LiquidateInput3'],
              type: 3,
            },
          },
          {
            label: 'amount_to_repay',
            type: {
              displayName: ['lendingpoolliquidate_external', 'LiquidateInput4'],
              type: 10,
            },
          },
          {
            label: 'minimum_recieved_for_one_repaid_token_e12',
            type: {
              displayName: ['lendingpoolliquidate_external', 'LiquidateInput5'],
              type: 11,
            },
          },
          {
            label: 'data',
            type: {
              displayName: ['lendingpoolliquidate_external', 'LiquidateInput6'],
              type: 19,
            },
          },
        ],
        docs: [
          ' is used by a liquidator to liquidate the uncollateralized position of another user',
          '',
          ' * `liquidated_user` - AccountId (aka address) of a user whose position should be liquidated. liquidated_user must be undercollateralized',
          ' * `asset_to_repay` - AccountId (aka address) of PSP22 that liquidated_user has debt in.',
          ' * `asset_to_take` - AccountId (aka address) of PSP22 that liquidated_user has supplied and is using as collateral.',
          '     This asset will be a liquidator reward i.e. it will be transferred to his Account.',
          ' * `amount_to_repay` - the number of tokens to be repaid. Pass None to repay all debt or Some in absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000).',
          ' * `minimum_recieved_for_one_repaid_token_e12` - minimum amount of asset_to_take to be received by liquidator per 1 repaid token multiplied by 10^12.',
          '     Notice!!! In the case of AZERO 1 token is 10^-12 of AZERO and in the case of USDT 1 token is 10^-6 of AZERO. The liquidator must be conscious and use absolute values.',
          ' * `data` - additional data to specify liquidate options. Right now it is only used to specify Variable or Stable debts to be liquidated.',
        ],
        label: 'LendingPoolLiquidate::liquidate',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 32,
        },
        selector: '0x6d61b4a5',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmaintain_external', 'InsertReserveTokenPriceE8Input1'],
              type: 3,
            },
          },
          {
            label: 'price_e8',
            type: {
              displayName: ['lendingpoolmaintain_external', 'InsertReserveTokenPriceE8Input2'],
              type: 11,
            },
          },
        ],
        docs: [
          " is used by anyone to update reserve's asset price //TODO",
          '',
          '  * `reserve_token_address` - AccountId (aka address) of an asset to update price for',
          '  * `price_e8` - price of the token in E8 notation (multiplied by 10^8)',
        ],
        label: 'LendingPoolMaintain::insert_reserve_token_price_e8',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x42dc15bf',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmaintain_external', 'AccumulateInterestInput1'],
              type: 3,
            },
          },
        ],
        docs: [
          ' is used by anyone to accumulate deposit and variable rate interests',
          '',
          '  * `asset` - AccountId (aka address) of asset of which interests should be accumulated',
        ],
        label: 'LendingPoolMaintain::accumulate_interest',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xf58c7316',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveIsFreezedInput1'],
              type: 3,
            },
          },
          {
            label: 'freeze',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveIsFreezedInput2'],
              type: 0,
            },
          },
        ],
        docs: [
          '  freezes or unfreezes reserv',
          '',
          '  * `freeze` - true if reserve should be freezed. flase if reserve should be unffreeze. When freezed supplying and borrowing are disabled.',
        ],
        label: 'LendingPoolManage::set_reserve_is_freezed',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xc4f08136',
      },
      {
        args: [
          {
            label: 'provider_address',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetBlockTimestampProviderInput1'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolManage::set_block_timestamp_provider',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x70511e1a',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput1'],
              type: 3,
            },
          },
          {
            label: 'interest_rate_model',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput2'],
              type: 35,
            },
          },
          {
            label: 'maximal_total_supply',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput3'],
              type: 10,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput4'],
              type: 10,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput5'],
              type: 11,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput6'],
              type: 11,
            },
          },
          {
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput7'],
              type: 11,
            },
          },
          {
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveParametersInput8'],
              type: 11,
            },
          },
        ],
        docs: [
          " modifies reserve in the `LendingPool`'s storage",
          '',
          '  * `asset` - `AccountId` of the registered asset',
          '  * `maximal_total_supply` - maximal allowed total supply, If exceeded no more deposits are accepted. None for uncapped total supply.',
          '  * `maximal_total_debt` - maximal allowed total debt, If exceeded no more borrows are accepted. None for uncapped total debt.',
          '  * `minimal_collateral` - the required minimal deposit of the asset by user to turn asset to be collateral.',
          '  * `minimal_debt` - the minimal possible debt that can be taken by user.',
          '  * `income_for_suppliers_part_e6` - indicates which part of an income should suppliers be paid - in E6 notation (multiplied by 10^6)',
          '  * `flash_loan_fee_e6` - fee (percentage) to charge for taking a flash loan for this asset - in E6 notation (multiplied by 10^6)',
        ],
        label: 'LendingPoolManage::set_reserve_parameters',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xda202b32',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveIsActiveInput1'],
              type: 3,
            },
          },
          {
            label: 'active',
            type: {
              displayName: ['lendingpoolmanage_external', 'SetReserveIsActiveInput2'],
              type: 0,
            },
          },
        ],
        docs: [
          '  activates or disactivates reserv',
          '',
          '  * `active` - true if reserve should be activated. flase if reserve should be disactivated. When disactivated all actions on the reserve are disabled.',
        ],
        label: 'LendingPoolManage::set_reserve_is_active',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x1896b613',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['lendingpoolmanage_external', 'ModifyAssetRuleInput1'],
              type: 12,
            },
          },
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmanage_external', 'ModifyAssetRuleInput2'],
              type: 3,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'ModifyAssetRuleInput3'],
              type: 10,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'ModifyAssetRuleInput4'],
              type: 10,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'ModifyAssetRuleInput5'],
              type: 10,
            },
          },
        ],
        docs: [
          ' modifies asset_rules of a given asset in the market rule identified by market_rule_id',
          '',
          ' * `market_rule_id` - id of market rule which shuuld be modified',
          ' * `asset` - `AccountId` of a asset which rules should be modified',
          "  * `collateral_coefficient_e6' - asset's collateral power. 1 = 10^6. If None asset can NOT be a collateral.",
          "  * `borrow_coefficient_e6' - asset's borrow power. 1 = 10^6. If None asset can NOT be borrowed.",
          '  * `penalty_e6 - penalty taken when taking part inliquidation as collateral or debt. 10^6 = 100%`.',
        ],
        label: 'LendingPoolManage::modify_asset_rule',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x276c5154',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['lendingpoolmanage_external', 'TakeProtocolIncomeInput1'],
              type: 36,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['lendingpoolmanage_external', 'TakeProtocolIncomeInput2'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolManage::take_protocol_income',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 37,
        },
        selector: '0x01144880',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput1'],
              type: 3,
            },
          },
          {
            label: 'decimals',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput2'],
              type: 11,
            },
          },
          {
            label: 'collateral_coefficient_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput3'],
              type: 10,
            },
          },
          {
            label: 'borrow_coefficient_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput4'],
              type: 10,
            },
          },
          {
            label: 'penalty_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput5'],
              type: 10,
            },
          },
          {
            label: 'maximal_total_supply',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput6'],
              type: 10,
            },
          },
          {
            label: 'maximal_total_debt',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput7'],
              type: 10,
            },
          },
          {
            label: 'minimal_collateral',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput8'],
              type: 11,
            },
          },
          {
            label: 'minimal_debt',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput9'],
              type: 11,
            },
          },
          {
            label: 'income_for_suppliers_part_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput10'],
              type: 11,
            },
          },
          {
            label: 'flash_loan_fee_e6',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput11'],
              type: 11,
            },
          },
          {
            label: 'a_token_address',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput12'],
              type: 3,
            },
          },
          {
            label: 'v_token_address',
            type: {
              displayName: ['lendingpoolmanage_external', 'RegisterAssetInput13'],
              type: 3,
            },
          },
        ],
        docs: [
          " Registers new asset in the `LendingPool`'s storage",
          '',
          '  * `asset` - `AccountId` of the registered asset',
          '  * `decimals` - a decimal denominator of an asset (number already multiplied by 10^N where N is number of decimals)',
          "  * `collateral_coefficient_e6' - asset's collateral power. 1 = 10^6. If None asset can NOT be a collateral.",
          "  * `borrow_coefficient_e6' - asset's borrow power. 1 = 10^6. If None asset can NOT be borrowed.",
          '  * `penalty_e6 - penalty taken when taking part inliquidation as collateral or debt. 10^6 = 100%`.',
          '  * `maximal_total_supply` - maximal allowed total supply, If exceeded no more deposits are accepted. None for uncapped total supply.',
          '  * `maximal_total_debt` - maximal allowed total debt, If exceeded no more borrows are accepted. None for uncapped total debt.',
          '  * `minimal_collateral` - the required minimal deposit of the asset by user to turn asset to be collateral.',
          '  * `minimal_debt` - the minimal possible debt that can be taken by user.',
          '  * `income_for_suppliers_part_e6` - indicates which part of an income should suppliers be paid - in E6 notation (multiplied by 10^6)',
          '  * `flash_loan_fee_e6` - fee (percentage) to charge for taking a flash loan for this asset - in E6 notation (multiplied by 10^6)',
          "  * `a_token_address` - `AccountId` of the asset's already deployed `AToken`",
          "  * `v_token_address` - `AccountId` of the asset's already deployed `VToken`",
        ],
        label: 'LendingPoolManage::register_asset',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0x63ca0624',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['lendingpoolmanage_external', 'AddMarketRuleInput1'],
              type: 12,
            },
          },
          {
            label: 'market_rule',
            type: {
              displayName: ['lendingpoolmanage_external', 'AddMarketRuleInput2'],
              type: 7,
            },
          },
        ],
        docs: [
          ' adds new market rule at unused market_rule_id',
          '',
          ' * `market_rule_id` - yet unused id for new market rule',
          ' * `market_rule` - list of asset rules for that market rule',
        ],
        label: 'LendingPoolManage::add_market_rule',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 15,
        },
        selector: '0xc240467e',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['lendingpoolview_external', 'ViewUserReserveDatasInput1'],
              type: 36,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['lendingpoolview_external', 'ViewUserReserveDatasInput2'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_user_reserve_datas',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 42,
        },
        selector: '0x7a1c9243',
      },
      {
        args: [
          {
            label: 'user',
            type: {
              displayName: ['lendingpoolview_external', 'ViewUserConfigInput1'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_user_config',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 46,
        },
        selector: '0xe6ef16de',
      },
      {
        args: [],
        docs: [],
        label: 'LendingPoolView::get_block_timestamp_provider_address',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 48,
        },
        selector: '0xe598e179',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['lendingpoolview_external', 'ViewReserveDatasInput1'],
              type: 36,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_reserve_datas',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 49,
        },
        selector: '0x33333dd4',
      },
      {
        args: [
          {
            label: 'assets',
            type: {
              displayName: ['lendingpoolview_external', 'ViewProtocolIncomeInput1'],
              type: 36,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_protocol_income',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 54,
        },
        selector: '0xa6121b9f',
      },
      {
        args: [],
        docs: [],
        label: 'LendingPoolView::view_registered_assets',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 55,
        },
        selector: '0x7ee520ac',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolview_external', 'ViewUserReserveDataInput1'],
              type: 3,
            },
          },
          {
            label: 'account',
            type: {
              displayName: ['lendingpoolview_external', 'ViewUserReserveDataInput2'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_user_reserve_data',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 56,
        },
        selector: '0xbf86b805',
      },
      {
        args: [
          {
            label: 'market_rule_id',
            type: {
              displayName: ['lendingpoolview_external', 'ViewMarketRuleInput1'],
              type: 12,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_market_rule',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 57,
        },
        selector: '0x5e701ec3',
      },
      {
        args: [
          {
            label: 'user_address',
            type: {
              displayName: ['lendingpoolview_external', 'GetUserFreeCollateralCoefficientInput1'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::get_user_free_collateral_coefficient',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 59,
        },
        selector: '0xd802407c',
      },
      {
        args: [
          {
            label: 'reserve_token_address',
            type: {
              displayName: ['lendingpoolview_external', 'GetReserveTokenPriceE8Input1'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::get_reserve_token_price_e8',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 61,
        },
        selector: '0x504a5adc',
      },
      {
        args: [
          {
            label: 'asset',
            type: {
              displayName: ['lendingpoolview_external', 'ViewReserveDataInput1'],
              type: 3,
            },
          },
        ],
        docs: [],
        label: 'LendingPoolView::view_reserve_data',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 62,
        },
        selector: '0xc4adf4e3',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'TransferSupplyFromToInput1'],
              type: 3,
            },
          },
          {
            label: 'from',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'TransferSupplyFromToInput2'],
              type: 3,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'TransferSupplyFromToInput3'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'TransferSupplyFromToInput4'],
              type: 11,
            },
          },
        ],
        docs: [
          ' Transfers an `amount` of `underlying_asset` supply on the behalf of `from` to the account `to`',
          '',
          ' * `underlying_asset` - AccountId (aka address) of an asset to transfer tokens from/to.',
          ' * `from` - AccountId (aka address) of an user to transfer from.',
          ' * `to` - AccountId (aka address) of an user to transfer to.',
          '',
          " On success a number of PSP22's `Transfer` events are emitted.",
          ' The number of events and their type/values depend on the interests that may be accrued both for `from` and `to` accounts.',
          '',
          ' # Errors',
          '',
          ' Returns `TransfersDisabled` error if deposit for given `underlying_asset` is disabled.',
          '',
          " Returns `WrongCaller` error if the caller is not an `underlying_asset`'s AToken contract.",
          '',
          ' Returns `InsufficientBalance` error if there are not enough tokens on',
          ' the the account Balance of `from`.',
        ],
        label: 'LendingPoolATokenInterface::transfer_supply_from_to',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 63,
        },
        selector: '0xacd47ab2',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'TotalSupplyOfInput1'],
              type: 3,
            },
          },
        ],
        docs: [
          " Returns LendingPool's total supply of an underlying asset.",
          '',
          ' * `underlying_asset` - AccountId (aka address) of an asset to look up total supply of.',
        ],
        label: 'LendingPoolATokenInterface::total_supply_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 66,
        },
        selector: '0xed264227',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'UserSupplyOfInput1'],
              type: 3,
            },
          },
          {
            label: 'user',
            type: {
              displayName: ['lendingpoolatokeninterface_external', 'UserSupplyOfInput2'],
              type: 3,
            },
          },
        ],
        docs: [
          " Returns the specified `user`'s account Balance of an `underlying_asset`.",
          '',
          ' * `underlying_asset` - AccountId (aka address) of an asset to look up supply of.',
          ' * `user` - AccountId (aka address) of an user to look up supply of.',
        ],
        label: 'LendingPoolATokenInterface::user_supply_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 66,
        },
        selector: '0x346bd340',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'UserVariableDebtOfInput1'],
              type: 3,
            },
          },
          {
            label: 'user',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'UserVariableDebtOfInput2'],
              type: 3,
            },
          },
        ],
        docs: [
          " Returns the specified `user`'s variable debt in the context of an `underlying_asset`.",
          '',
          " * `underlying_asset` - AccountId (aka address) of an asset to look up user's variable debt of.",
          ' * `user` - AccountId (aka address) of an user to look up variable debt for.',
        ],
        label: 'LendingPoolVTokenInterface::user_variable_debt_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 66,
        },
        selector: '0x89a85a08',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'TransferVariableDebtFromToInput1'],
              type: 3,
            },
          },
          {
            label: 'from',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'TransferVariableDebtFromToInput2'],
              type: 3,
            },
          },
          {
            label: 'to',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'TransferVariableDebtFromToInput3'],
              type: 3,
            },
          },
          {
            label: 'amount',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'TransferVariableDebtFromToInput4'],
              type: 11,
            },
          },
        ],
        docs: [
          ' Transfers an `amount` of variable debt on the behalf of `from` to the account `to` in the context of an `underlying_asset`.',
          '',
          ' * `underlying_asset` - AccountId (aka address) of an asset to transfer variable debt from/to.',
          ' * `from` - AccountId (aka address) of an user to transfer from.',
          ' * `to` - AccountId (aka address) of an user to transfer to.',
          '',
          " On success a number of PSP22's `Transfer` events are emitted.",
          ' The number of events and their type/values depend on the interests that may be accrued both for `from` and `to` accounts.',
          '',
          ' # Errors',
          '',
          ' Returns `TransfersDisabled` error if deposit for given `underlying_asset` is disabled.',
          '',
          " Returns `WrongCaller` error if the caller is not an `underlying_asset`'s VToken contract.",
          '',
          ' Returns `InsufficientBalance` error if there are not enough tokens on',
          ' the the account Balance of `from`.',
        ],
        label: 'LendingPoolVTokenInterface::transfer_variable_debt_from_to',
        mutates: true,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 63,
        },
        selector: '0x3356028c',
      },
      {
        args: [
          {
            label: 'underlying_asset',
            type: {
              displayName: ['lendingpoolvtokeninterface_external', 'TotalVariableDebtOfInput1'],
              type: 3,
            },
          },
        ],
        docs: [
          " Returns LendingPool's total variable debt of users in the context of an underlying asset.",
          '',
          ' * `underlying_asset` - AccountId (aka address) of an asset to look up total variable debt of.',
        ],
        label: 'LendingPoolVTokenInterface::total_variable_debt_of',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 66,
        },
        selector: '0x1f202294',
      },
      {
        args: [],
        docs: [' Returns true if the contract is paused, and false otherwise.'],
        label: 'Pausable::paused',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['ink', 'MessageResult'],
          type: 28,
        },
        selector: '0xd123ce11',
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
                        leaf: {
                          key: '0x00000000',
                          ty: 0,
                        },
                      },
                      name: 'paused',
                    },
                    {
                      layout: {
                        enum: {
                          dispatchKey: '0x00000000',
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
                                      key: '0x00000000',
                                      ty: 1,
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
                      name: '_reserved',
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
                              key: '0x6a2cd2b4',
                              ty: 2,
                            },
                          },
                          root_key: '0x6a2cd2b4',
                        },
                      },
                      name: 'admin_roles',
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
                                      key: '0x5d5db175',
                                      ty: 1,
                                    },
                                  },
                                  root_key: '0x5d5db175',
                                },
                              },
                              name: 'members',
                            },
                            {
                              layout: {
                                enum: {
                                  dispatchKey: '0x00000000',
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
                                              key: '0x00000000',
                                              ty: 1,
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
                              name: '_reserved',
                            },
                          ],
                          name: 'Members',
                        },
                      },
                      name: 'members',
                    },
                    {
                      layout: {
                        enum: {
                          dispatchKey: '0x00000000',
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
                                      key: '0x00000000',
                                      ty: 1,
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
                      name: '_reserved',
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
                        leaf: {
                          key: '0x00000000',
                          ty: 3,
                        },
                      },
                      name: 'block_timestamp_provider',
                    },
                    {
                      layout: {
                        leaf: {
                          key: '0x00000000',
                          ty: 6,
                        },
                      },
                      name: 'registered_assets',
                    },
                    {
                      layout: {
                        root: {
                          layout: {
                            leaf: {
                              key: '0x3d924a4b',
                              ty: 7,
                            },
                          },
                          root_key: '0x3d924a4b',
                        },
                      },
                      name: 'market_rule_id_to_market_rule',
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
                                      key: '0xbfece219',
                                      ty: 12,
                                    },
                                  },
                                  name: 'id',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 0,
                                    },
                                  },
                                  name: 'activated',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 0,
                                    },
                                  },
                                  name: 'freezed',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'decimals',
                                },
                                {
                                  layout: {
                                    array: {
                                      layout: {
                                        leaf: {
                                          key: '0xbfece219',
                                          ty: 11,
                                        },
                                      },
                                      len: 7,
                                      offset: '0xbfece219',
                                    },
                                  },
                                  name: 'interest_rate_model',
                                },
                                {
                                  layout: {
                                    enum: {
                                      dispatchKey: '0xbfece219',
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
                                                  key: '0xbfece219',
                                                  ty: 11,
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
                                      dispatchKey: '0xbfece219',
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
                                                  key: '0xbfece219',
                                                  ty: 11,
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
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'minimal_collateral',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'minimal_debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'income_for_suppliers_part_e6',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'flash_loan_fee_e6',
                                },
                                {
                                  layout: {
                                    enum: {
                                      dispatchKey: '0xbfece219',
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
                                                  key: '0xbfece219',
                                                  ty: 11,
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
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'total_supplied',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'cumulative_supply_rate_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'current_supply_rate_e24',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'total_debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'cumulative_debt_rate_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 11,
                                    },
                                  },
                                  name: 'current_debt_rate_e24',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 12,
                                    },
                                  },
                                  name: 'indexes_update_timestamp',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 3,
                                    },
                                  },
                                  name: 'a_token_address',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xbfece219',
                                      ty: 3,
                                    },
                                  },
                                  name: 'v_token_address',
                                },
                              ],
                              name: 'ReserveData',
                            },
                          },
                          root_key: '0xbfece219',
                        },
                      },
                      name: 'asset_to_reserve_data',
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
                                      key: '0xf64fd95f',
                                      ty: 11,
                                    },
                                  },
                                  name: 'supplied',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xf64fd95f',
                                      ty: 11,
                                    },
                                  },
                                  name: 'debt',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xf64fd95f',
                                      ty: 11,
                                    },
                                  },
                                  name: 'applied_cumulative_supply_rate_index_e18',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0xf64fd95f',
                                      ty: 11,
                                    },
                                  },
                                  name: 'applied_cumulative_debt_rate_index_e18',
                                },
                              ],
                              name: 'UserReserveData',
                            },
                          },
                          root_key: '0xf64fd95f',
                        },
                      },
                      name: 'asset_and_user_to_user_reserve_data',
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
                                      key: '0x3dd00c7a',
                                      ty: 11,
                                    },
                                  },
                                  name: 'deposits',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x3dd00c7a',
                                      ty: 11,
                                    },
                                  },
                                  name: 'collaterals',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x3dd00c7a',
                                      ty: 11,
                                    },
                                  },
                                  name: 'borrows',
                                },
                                {
                                  layout: {
                                    leaf: {
                                      key: '0x3dd00c7a',
                                      ty: 12,
                                    },
                                  },
                                  name: 'market_rule_id',
                                },
                              ],
                              name: 'UserConfig',
                            },
                          },
                          root_key: '0x3dd00c7a',
                        },
                      },
                      name: 'user_to_user_config',
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
          tuple: [],
        },
      },
    },
    {
      id: 2,
      type: {
        def: {
          primitive: 'u32',
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
            type: 3,
          },
        },
      },
    },
    {
      id: 7,
      type: {
        def: {
          sequence: {
            type: 8,
          },
        },
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
          composite: {
            fields: [
              {
                name: 'collateral_coefficient_e6',
                type: 10,
                typeName: 'Option<u128>',
              },
              {
                name: 'borrow_coefficient_e6',
                type: 10,
                typeName: 'Option<u128>',
              },
              {
                name: 'penalty_e6',
                type: 10,
                typeName: 'Option<u128>',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'asset_rules', 'AssetRules'],
      },
    },
    {
      id: 10,
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
                    type: 11,
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
            type: 11,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 11,
      type: {
        def: {
          primitive: 'u128',
        },
      },
    },
    {
      id: 12,
      type: {
        def: {
          primitive: 'u64',
        },
      },
    },
    {
      id: 13,
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
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 14,
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
      id: 15,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 16,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 16,
          },
          {
            name: 'E',
            type: 14,
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
                    type: 1,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 17,
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
            type: 17,
          },
        ],
        path: ['Result'],
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
                    typeName: 'StorageError',
                  },
                ],
                index: 1,
                name: 'StorageError',
              },
              {
                fields: [
                  {
                    type: 22,
                    typeName: 'FlashLoanReceiverError',
                  },
                ],
                index: 2,
                name: 'FlashLoanReceiverError',
              },
              {
                fields: [
                  {
                    type: 23,
                    typeName: 'AccessControlError',
                  },
                ],
                index: 3,
                name: 'AccessControlError',
              },
              {
                fields: [
                  {
                    type: 24,
                    typeName: 'PausableError',
                  },
                ],
                index: 4,
                name: 'PausableError',
              },
              {
                fields: [
                  {
                    type: 14,
                    typeName: 'LangError',
                  },
                ],
                index: 5,
                name: 'LangError',
              },
              {
                index: 6,
                name: 'Inactive',
              },
              {
                index: 7,
                name: 'Freezed',
              },
              {
                index: 8,
                name: 'AssetNotRegistered',
              },
              {
                index: 9,
                name: 'RuleBorrowDisable',
              },
              {
                index: 10,
                name: 'RuleCollateralDisable',
              },
              {
                index: 11,
                name: 'InsufficientCollateral',
              },
              {
                index: 12,
                name: 'InsufficientDebt',
              },
              {
                index: 13,
                name: 'Collaterized',
              },
              {
                index: 14,
                name: 'InsufficientSupply',
              },
              {
                index: 15,
                name: 'MinimumRecieved',
              },
              {
                index: 16,
                name: 'AmountNotGreaterThanZero',
              },
              {
                index: 17,
                name: 'AmountExceedsUserDeposit',
              },
              {
                index: 18,
                name: 'AssetPriceNotInitialized',
              },
              {
                index: 19,
                name: 'AmountExceedsUserDebt',
              },
              {
                index: 20,
                name: 'NothingToRepay',
              },
              {
                index: 21,
                name: 'NothingToCompensateWith',
              },
              {
                index: 22,
                name: 'TakingNotACollateral',
              },
              {
                index: 23,
                name: 'FlashLoanAmountsAssetsInconsistentLengths',
              },
              {
                index: 24,
                name: 'MaxSupplyReached',
              },
              {
                index: 25,
                name: 'MaxDebtReached',
              },
              {
                index: 26,
                name: 'MarketRuleInvalidAssetId',
              },
              {
                index: 27,
                name: 'MarketRuleInvalidId',
              },
              {
                index: 28,
                name: 'MarketRulePenaltyNotSet',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'lending_pool', 'errors', 'LendingPoolError'],
      },
    },
    {
      id: 18,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 19,
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
                    type: 19,
                    typeName: 'String',
                  },
                ],
                index: 5,
                name: 'SafeTransferCheckFailed',
              },
            ],
          },
        },
        path: ['openbrush_contracts', 'traits', 'errors', 'psp22', 'PSP22Error'],
      },
    },
    {
      id: 19,
      type: {
        def: {
          sequence: {
            type: 5,
          },
        },
      },
    },
    {
      id: 20,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 21,
                    typeName: 'String',
                  },
                ],
                index: 0,
                name: 'EntityNotFound',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'lending_pool', 'errors', 'StorageError'],
      },
    },
    {
      id: 21,
      type: {
        def: {
          primitive: 'str',
        },
      },
    },
    {
      id: 22,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 21,
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
      id: 23,
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
        path: ['openbrush_contracts', 'traits', 'errors', 'access_control', 'AccessControlError'],
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
                name: 'Paused',
              },
              {
                index: 1,
                name: 'NotPaused',
              },
            ],
          },
        },
        path: ['openbrush_contracts', 'traits', 'errors', 'pausable', 'PausableError'],
      },
    },
    {
      id: 25,
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
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
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
                    type: 14,
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
            type: 14,
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
                    type: 1,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 23,
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
            type: 23,
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
                    type: 0,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 29,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 30,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 30,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
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
                    type: 11,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 17,
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
            type: 11,
          },
          {
            name: 'E',
            type: 17,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 31,
      type: {
        def: {
          sequence: {
            type: 11,
          },
        },
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
                    type: 14,
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
            type: 14,
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
                    type: 17,
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
            type: 17,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 34,
      type: {
        def: {
          tuple: [11, 11],
        },
      },
    },
    {
      id: 35,
      type: {
        def: {
          array: {
            len: 7,
            type: 11,
          },
        },
      },
    },
    {
      id: 36,
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
      id: 37,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 38,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 38,
          },
          {
            name: 'E',
            type: 14,
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
                    type: 17,
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
            type: 17,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 39,
      type: {
        def: {
          sequence: {
            type: 40,
          },
        },
      },
    },
    {
      id: 40,
      type: {
        def: {
          tuple: [3, 41],
        },
      },
    },
    {
      id: 41,
      type: {
        def: {
          primitive: 'i128',
        },
      },
    },
    {
      id: 42,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 43,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 43,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 43,
      type: {
        def: {
          sequence: {
            type: 44,
          },
        },
      },
    },
    {
      id: 44,
      type: {
        def: {
          tuple: [3, 45],
        },
      },
    },
    {
      id: 45,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'supplied',
                type: 11,
                typeName: 'Balance',
              },
              {
                name: 'debt',
                type: 11,
                typeName: 'Balance',
              },
              {
                name: 'applied_cumulative_supply_rate_index_e18',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'applied_cumulative_debt_rate_index_e18',
                type: 11,
                typeName: 'u128',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'user_reserve_data', 'UserReserveData'],
      },
    },
    {
      id: 46,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 47,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 47,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 47,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'deposits',
                type: 11,
                typeName: 'Bitmap128',
              },
              {
                name: 'collaterals',
                type: 11,
                typeName: 'Bitmap128',
              },
              {
                name: 'borrows',
                type: 11,
                typeName: 'Bitmap128',
              },
              {
                name: 'market_rule_id',
                type: 12,
                typeName: 'u64',
              },
            ],
          },
        },
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'user_config', 'UserConfig'],
      },
    },
    {
      id: 48,
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
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 49,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 50,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 50,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 50,
      type: {
        def: {
          sequence: {
            type: 51,
          },
        },
      },
    },
    {
      id: 51,
      type: {
        def: {
          tuple: [3, 52],
        },
      },
    },
    {
      id: 52,
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
                    type: 53,
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
            type: 53,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 53,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'id',
                type: 12,
                typeName: 'u64',
              },
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
                name: 'decimals',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'interest_rate_model',
                type: 35,
                typeName: '[u128; 7]',
              },
              {
                name: 'maximal_total_supply',
                type: 10,
                typeName: 'Option<Balance>',
              },
              {
                name: 'maximal_total_debt',
                type: 10,
                typeName: 'Option<Balance>',
              },
              {
                name: 'minimal_collateral',
                type: 11,
                typeName: 'Balance',
              },
              {
                name: 'minimal_debt',
                type: 11,
                typeName: 'Balance',
              },
              {
                name: 'income_for_suppliers_part_e6',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'flash_loan_fee_e6',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'token_price_e8',
                type: 10,
                typeName: 'Option<u128>',
              },
              {
                name: 'total_supplied',
                type: 11,
                typeName: 'Balance',
              },
              {
                name: 'cumulative_supply_rate_index_e18',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'current_supply_rate_e24',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'total_debt',
                type: 11,
                typeName: 'Balance',
              },
              {
                name: 'cumulative_debt_rate_index_e18',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'current_debt_rate_e24',
                type: 11,
                typeName: 'u128',
              },
              {
                name: 'indexes_update_timestamp',
                type: 12,
                typeName: 'Timestamp',
              },
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
        path: ['lending_project', 'impls', 'lending_pool', 'storage', 'structs', 'reserve_data', 'ReserveData'],
      },
    },
    {
      id: 54,
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
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 55,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    type: 6,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 6,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
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
                    type: 45,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 14,
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
                fields: [
                  {
                    type: 58,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 58,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 58,
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
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
      },
    },
    {
      id: 60,
      type: {
        def: {
          tuple: [0, 11],
        },
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
                    type: 10,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 14,
          },
        ],
        path: ['Result'],
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
                    type: 52,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 52,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
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
                    type: 14,
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
            type: 14,
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
                    type: 65,
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
            type: 65,
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
                fields: [
                  {
                    type: 18,
                    typeName: 'PSP22Error',
                  },
                ],
                index: 0,
                name: 'PSP22Error',
              },
              {
                fields: [
                  {
                    type: 24,
                    typeName: 'PausableError',
                  },
                ],
                index: 1,
                name: 'PausableError',
              },
              {
                fields: [
                  {
                    type: 20,
                    typeName: 'StorageError',
                  },
                ],
                index: 2,
                name: 'StorageError',
              },
              {
                index: 3,
                name: 'InsufficientBalance',
              },
              {
                index: 4,
                name: 'WrongCaller',
              },
              {
                index: 5,
                name: 'InsufficientCollateral',
              },
              {
                index: 6,
                name: 'TransfersDisabled',
              },
              {
                index: 7,
                name: 'MinimalDebt',
              },
              {
                index: 8,
                name: 'MinimalSupply',
              },
              {
                index: 9,
                name: 'AssetNotRegistered',
              },
              {
                index: 10,
                name: 'MarketRule',
              },
            ],
          },
        },
        path: ['lending_project', 'traits', 'lending_pool', 'errors', 'LendingPoolTokenInterfaceError'],
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
                    type: 11,
                  },
                ],
                index: 0,
                name: 'Ok',
              },
              {
                fields: [
                  {
                    type: 14,
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
            type: 11,
          },
          {
            name: 'E',
            type: 14,
          },
        ],
        path: ['Result'],
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

  AccessControl_get_role_admin(role: number): Promise<Result<number, LangError>> {
    return this.stateCall('0x83da3bb2', [role]);
  }

  AccessControl_has_role(role: number, address: AccountId): Promise<Result<boolean, LangError>> {
    return this.stateCall('0xc1d9ac18', [role, address]);
  }

  LendingPoolView_view_user_reserve_datas(
    assets: AccountId[] | undefined,
    account: AccountId,
  ): Promise<Result<[AccountId, UserReserveData][], LangError>> {
    return this.stateCall('0x7a1c9243', [assets, account]);
  }

  LendingPoolView_view_user_config(user: AccountId): Promise<Result<UserConfig, LangError>> {
    return this.stateCall('0xe6ef16de', [user]);
  }

  LendingPoolView_get_block_timestamp_provider_address(): Promise<Result<AccountId, LangError>> {
    return this.stateCall('0xe598e179', []);
  }

  LendingPoolView_view_reserve_datas(assets: AccountId[] | undefined): Promise<Result<[AccountId, ReserveData | undefined][], LangError>> {
    return this.stateCall('0x33333dd4', [assets]);
  }

  LendingPoolView_view_protocol_income(assets: AccountId[] | undefined): Promise<Result<[AccountId, bigint][], LangError>> {
    return this.stateCall('0xa6121b9f', [assets]);
  }

  LendingPoolView_view_registered_assets(): Promise<Result<AccountId[], LangError>> {
    return this.stateCall('0x7ee520ac', []);
  }

  LendingPoolView_view_user_reserve_data(asset: AccountId, account: AccountId): Promise<Result<UserReserveData, LangError>> {
    return this.stateCall('0xbf86b805', [asset, account]);
  }

  LendingPoolView_view_market_rule(market_rule_id: bigint): Promise<Result<(AssetRules | undefined)[] | undefined, LangError>> {
    return this.stateCall('0x5e701ec3', [market_rule_id]);
  }

  LendingPoolView_get_user_free_collateral_coefficient(user_address: AccountId): Promise<Result<[boolean, bigint], LangError>> {
    return this.stateCall('0xd802407c', [user_address]);
  }

  LendingPoolView_get_reserve_token_price_e8(reserve_token_address: AccountId): Promise<Result<bigint | undefined, LangError>> {
    return this.stateCall('0x504a5adc', [reserve_token_address]);
  }

  LendingPoolView_view_reserve_data(asset: AccountId): Promise<Result<ReserveData | undefined, LangError>> {
    return this.stateCall('0xc4adf4e3', [asset]);
  }

  LendingPoolATokenInterface_total_supply_of(underlying_asset: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0xed264227', [underlying_asset]);
  }

  LendingPoolATokenInterface_user_supply_of(underlying_asset: AccountId, user: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x346bd340', [underlying_asset, user]);
  }

  LendingPoolVTokenInterface_user_variable_debt_of(underlying_asset: AccountId, user: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x89a85a08', [underlying_asset, user]);
  }

  LendingPoolVTokenInterface_total_variable_debt_of(underlying_asset: AccountId): Promise<Result<bigint, LangError>> {
    return this.stateCall('0x1f202294', [underlying_asset]);
  }

  Pausable_paused(): Promise<Result<boolean, LangError>> {
    return this.stateCall('0xd123ce11', []);
  }

  private async stateCall<T>(selector: string, args: any[]): Promise<T> {
    const input = _abi.encodeMessageInput(selector, args);
    const data = encodeCall(this.address, input);
    const result = await this.ctx._chain.rpc.call('state_call', ['ContractsApi_call', data, this.blockHash]);
    const value = decodeResult(result);
    return _abi.decodeMessageOutput(selector, value);
  }
}

export interface AssetRules {
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
}

export interface ReserveData {
  id: bigint;
  activated: boolean;
  freezed: boolean;
  decimals: bigint;
  interestRateModel: SetReserveParametersInput2;
  maximalTotalSupply?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
  incomeForSuppliersPartE6: bigint;
  flashLoanFeeE6: bigint;
  tokenPriceE8?: bigint | undefined;
  totalSupplied: bigint;
  cumulativeSupplyRateIndexE18: bigint;
  currentSupplyRateE24: bigint;
  totalDebt: bigint;
  cumulativeDebtRateIndexE18: bigint;
  currentDebtRateE24: bigint;
  indexesUpdateTimestamp: bigint;
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export type SetReserveParametersInput2 = bigint[];

export interface UserConfig {
  deposits: bigint;
  collaterals: bigint;
  borrows: bigint;
  marketRuleId: bigint;
}

export interface UserReserveData {
  supplied: bigint;
  debt: bigint;
  appliedCumulativeSupplyRateIndexE18: bigint;
  appliedCumulativeDebtRateIndexE18: bigint;
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
  | Message_LendingPoolManage_set_block_timestamp_provider
  | Message_LendingPoolManage_set_reserve_is_active
  | Message_LendingPoolManage_set_reserve_is_freezed
  | Message_LendingPoolManage_set_reserve_parameters
  | Message_LendingPoolManage_take_protocol_income
  | Message_LendingPoolVTokenInterface_total_variable_debt_of
  | Message_LendingPoolVTokenInterface_transfer_variable_debt_from_to
  | Message_LendingPoolVTokenInterface_user_variable_debt_of
  | Message_LendingPoolView_get_block_timestamp_provider_address
  | Message_LendingPoolView_get_reserve_token_price_e8
  | Message_LendingPoolView_get_user_free_collateral_coefficient
  | Message_LendingPoolView_view_market_rule
  | Message_LendingPoolView_view_protocol_income
  | Message_LendingPoolView_view_registered_assets
  | Message_LendingPoolView_view_reserve_data
  | Message_LendingPoolView_view_reserve_datas
  | Message_LendingPoolView_view_user_config
  | Message_LendingPoolView_view_user_reserve_data
  | Message_LendingPoolView_view_user_reserve_datas
  | Message_Pausable_paused
  | Message_pause
  | Message_unpause;

/**
 *  Returns the admin role that controls `role`. See `grant_role` and `revoke_role`.
 */
export interface Message_AccessControl_get_role_admin {
  __kind: 'AccessControl_get_role_admin';
  role: number;
}

/**
 *  Grants `role` to `account`.
 *
 *  On success a `RoleGranted` event is emitted.
 *
 *  # Errors
 *
 *  Returns with `MissingRole` error if caller can't grant the role.
 *  Returns with `RoleRedundant` error `account` has `role`.
 */
export interface Message_AccessControl_grant_role {
  __kind: 'AccessControl_grant_role';
  role: number;
  account: AccountId;
}

/**
 *  Returns `true` if `account` has been granted `role`.
 */
export interface Message_AccessControl_has_role {
  __kind: 'AccessControl_has_role';
  role: number;
  address: AccountId;
}

/**
 *  Revokes `role` from the calling account.
 *  Roles are often managed via `grant_role` and `revoke_role`: this function's
 *  purpose is to provide a mechanism for accounts to lose their privileges
 *  if they are compromised (such as when a trusted device is misplaced).
 *
 *  On success a `RoleRevoked` event is emitted.
 *
 *  # Errors
 *
 *  Returns with `InvalidCaller` error if caller is not `account`.
 *  Returns with `MissingRole` error if `account` doesn't have `role`.
 */
export interface Message_AccessControl_renounce_role {
  __kind: 'AccessControl_renounce_role';
  role: number;
  account: AccountId;
}

/**
 *  Revokes `role` from `account`.
 *
 *  On success a `RoleRevoked` event is emitted.
 *
 *  # Errors
 *
 *  Returns with `MissingRole` error if caller can't grant the `role` or if `account` doesn't have `role`.
 */
export interface Message_AccessControl_revoke_role {
  __kind: 'AccessControl_revoke_role';
  role: number;
  account: AccountId;
}

/**
 *  Returns LendingPool's total supply of an underlying asset.
 *
 *  * `underlying_asset` - AccountId (aka address) of an asset to look up total supply of.
 */
export interface Message_LendingPoolATokenInterface_total_supply_of {
  __kind: 'LendingPoolATokenInterface_total_supply_of';
  underlyingAsset: AccountId;
}

/**
 *  Transfers an `amount` of `underlying_asset` supply on the behalf of `from` to the account `to`
 *
 *  * `underlying_asset` - AccountId (aka address) of an asset to transfer tokens from/to.
 *  * `from` - AccountId (aka address) of an user to transfer from.
 *  * `to` - AccountId (aka address) of an user to transfer to.
 *
 *  On success a number of PSP22's `Transfer` events are emitted.
 *  The number of events and their type/values depend on the interests that may be accrued both for `from` and `to` accounts.
 *
 *  # Errors
 *
 *  Returns `TransfersDisabled` error if deposit for given `underlying_asset` is disabled.
 *
 *  Returns `WrongCaller` error if the caller is not an `underlying_asset`'s AToken contract.
 *
 *  Returns `InsufficientBalance` error if there are not enough tokens on
 *  the the account Balance of `from`.
 */
export interface Message_LendingPoolATokenInterface_transfer_supply_from_to {
  __kind: 'LendingPoolATokenInterface_transfer_supply_from_to';
  underlyingAsset: AccountId;
  from: AccountId;
  to: AccountId;
  amount: bigint;
}

/**
 *  Returns the specified `user`'s account Balance of an `underlying_asset`.
 *
 *  * `underlying_asset` - AccountId (aka address) of an asset to look up supply of.
 *  * `user` - AccountId (aka address) of an user to look up supply of.
 */
export interface Message_LendingPoolATokenInterface_user_supply_of {
  __kind: 'LendingPoolATokenInterface_user_supply_of';
  underlyingAsset: AccountId;
  user: AccountId;
}

/**
 *  is used by a user0, once he made a deposit and chosen users collaterals, to borrow an asset from LendingPool.
 *  user0 can specify a Variable or Stable borrow rate by passing 0 or 1 in data\[0\].
 *
 *
 *  * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.
 *  * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who
 *      user1 is making borrow. In case user0 != user1 the allowance on appropriate VToken or SToken will be decreased.
 *  * `amount` - the number of tokens to be borrowed in absolute value (1 USDT = 1_000_000, 1 AZERO = 1_000_000_000_000).
 *  * `data` - additional data to specify borrow options. Right now it is only used to specify Variable or Stable borrow rates.
 */
export interface Message_LendingPoolBorrow_borrow {
  __kind: 'LendingPoolBorrow_borrow';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
  data: Bytes;
}

/**
 *  is used by user to chose a market rule user want to use.
 *  After changing the chosen market rule users position should be collaterized
 *
 *  * `market_rule_id` - the id of the market_rule to use.
 */
export interface Message_LendingPoolBorrow_choose_market_rule {
  __kind: 'LendingPoolBorrow_choose_market_rule';
  marketRuleId: bigint;
}

/**
 *  is used by a user0, once he made a borrow, to repay a debt taken in the asset from LendingPool.
 *  user0 can specify a Variable or Stable debt to repay by passing 0 or 1 in data\[0\].
 *
 *
 *  * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.
 *  * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who
 *      user1 is making borrow. In case user0 != user1 the allowance on appropriate VToken or SToken will be decreased.
 *  * `amount_arg` - the number of tokens to be repaid. Pass None to repay all debt or Some in absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000).
 *  * `data` - additional data to specify repayment options. Right now it is only used to specify Variable or Stable borrow rates.
 */
export interface Message_LendingPoolBorrow_repay {
  __kind: 'LendingPoolBorrow_repay';
  asset: AccountId;
  onBehalfOf: AccountId;
  amountArg?: bigint | undefined;
  data: Bytes;
}

/**
 *  is used by a user to choose to use or not a given asset as a collateral
 *  i.e. if the user's deposit of this concrete asset should back his debt and be vulnerable to liquidation.
 *
 *  * `asset` - AccountId (aka address) of PSP22 that must be allowed to be collateral.
 *  * `use_as_collateral` - true if the user wants to use the asset as collateral, false in the opposite case.
 */
export interface Message_LendingPoolBorrow_set_as_collateral {
  __kind: 'LendingPoolBorrow_set_as_collateral';
  asset: AccountId;
  useAsCollateral: boolean;
}

/**
 *  is used by a user0, to deposit on an account of on_behalf_of an asset to LendingPool.
 *  Then, within the possibilities, a deposit can be marked as collateral and used to back a loan.
 *
 *  * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.
 *  * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who
 *      user0 is making a deposit.
 *  * `amount` - the number of tokens to be deposited in an absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000).
 *  * `data` - additional data that is currently unused. In the future it could for example specify some additional data to be passed during PSP22::transfer_from
 */
export interface Message_LendingPoolDeposit_deposit {
  __kind: 'LendingPoolDeposit_deposit';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount: bigint;
  data: Bytes;
}

/**
 *  is used by a user0, to redeem on an account of on_behalf_of an asset to LendingPool.
 *  Redeem can fail if the user has current debt and redeeming would make the user's position undercollateralized.
 *
 *  * `asset` - AccountId (aka address) of PSP22 that must be allowed to be borrowed.
 *  * `on_behalf_of` - AccountId (aka address) of a user1 (may be the same or not as user0) on behalf of who
 *      user0 is making redeem. If user0 != user1 then the allowance of on appropriate AToken will be decreased.
 *  * `amount` - the number of tokens to be redeemed in Some absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000) or None to redeem all.
 *  * `data` - additional data that is currently unused. In the future it could for example specify some additional data to be passed during PSP22::transfer_from
 */
export interface Message_LendingPoolDeposit_redeem {
  __kind: 'LendingPoolDeposit_redeem';
  asset: AccountId;
  onBehalfOf: AccountId;
  amount?: bigint | undefined;
  data: Bytes;
}

export interface Message_LendingPoolFlash_flash_loan {
  __kind: 'LendingPoolFlash_flash_loan';
  receiverAddress: AccountId;
  assets: AccountId[];
  amounts: bigint[];
  receiverParams: Bytes;
}

/**
 *  is used by a liquidator to liquidate the uncollateralized position of another user
 *
 *  * `liquidated_user` - AccountId (aka address) of a user whose position should be liquidated. liquidated_user must be undercollateralized
 *  * `asset_to_repay` - AccountId (aka address) of PSP22 that liquidated_user has debt in.
 *  * `asset_to_take` - AccountId (aka address) of PSP22 that liquidated_user has supplied and is using as collateral.
 *      This asset will be a liquidator reward i.e. it will be transferred to his Account.
 *  * `amount_to_repay` - the number of tokens to be repaid. Pass None to repay all debt or Some in absolute value (1USDT = 1_000_000, 1AZERO = 1_000_000_000_000).
 *  * `minimum_recieved_for_one_repaid_token_e12` - minimum amount of asset_to_take to be received by liquidator per 1 repaid token multiplied by 10^12.
 *      Notice!!! In the case of AZERO 1 token is 10^-12 of AZERO and in the case of USDT 1 token is 10^-6 of AZERO. The liquidator must be conscious and use absolute values.
 *  * `data` - additional data to specify liquidate options. Right now it is only used to specify Variable or Stable debts to be liquidated.
 */
export interface Message_LendingPoolLiquidate_liquidate {
  __kind: 'LendingPoolLiquidate_liquidate';
  liquidatedUser: AccountId;
  assetToRepay: AccountId;
  assetToTake: AccountId;
  amountToRepay?: bigint | undefined;
  minimumRecievedForOneRepaidTokenE12: bigint;
  data: Bytes;
}

/**
 *  is used by anyone to accumulate deposit and variable rate interests
 *
 *   * `asset` - AccountId (aka address) of asset of which interests should be accumulated
 */
export interface Message_LendingPoolMaintain_accumulate_interest {
  __kind: 'LendingPoolMaintain_accumulate_interest';
  asset: AccountId;
}

/**
 *  is used by anyone to update reserve's asset price //TODO
 *
 *   * `reserve_token_address` - AccountId (aka address) of an asset to update price for
 *   * `price_e8` - price of the token in E8 notation (multiplied by 10^8)
 */
export interface Message_LendingPoolMaintain_insert_reserve_token_price_e8 {
  __kind: 'LendingPoolMaintain_insert_reserve_token_price_e8';
  asset: AccountId;
  priceE8: bigint;
}

/**
 *  adds new market rule at unused market_rule_id
 *
 *  * `market_rule_id` - yet unused id for new market rule
 *  * `market_rule` - list of asset rules for that market rule
 */
export interface Message_LendingPoolManage_add_market_rule {
  __kind: 'LendingPoolManage_add_market_rule';
  marketRuleId: bigint;
  marketRule: (AssetRules | undefined)[];
}

/**
 *  modifies asset_rules of a given asset in the market rule identified by market_rule_id
 *
 *  * `market_rule_id` - id of market rule which shuuld be modified
 *  * `asset` - `AccountId` of a asset which rules should be modified
 *   * `collateral_coefficient_e6' - asset's collateral power. 1 = 10^6. If None asset can NOT be a collateral.
 *   * `borrow_coefficient_e6' - asset's borrow power. 1 = 10^6. If None asset can NOT be borrowed.
 *   * `penalty_e6 - penalty taken when taking part inliquidation as collateral or debt. 10^6 = 100%`.
 */
export interface Message_LendingPoolManage_modify_asset_rule {
  __kind: 'LendingPoolManage_modify_asset_rule';
  marketRuleId: bigint;
  asset: AccountId;
  collateralCoefficientE6?: bigint | undefined;
  borrowCoefficientE6?: bigint | undefined;
  penaltyE6?: bigint | undefined;
}

/**
 *  Registers new asset in the `LendingPool`'s storage
 *
 *   * `asset` - `AccountId` of the registered asset
 *   * `decimals` - a decimal denominator of an asset (number already multiplied by 10^N where N is number of decimals)
 *   * `collateral_coefficient_e6' - asset's collateral power. 1 = 10^6. If None asset can NOT be a collateral.
 *   * `borrow_coefficient_e6' - asset's borrow power. 1 = 10^6. If None asset can NOT be borrowed.
 *   * `penalty_e6 - penalty taken when taking part inliquidation as collateral or debt. 10^6 = 100%`.
 *   * `maximal_total_supply` - maximal allowed total supply, If exceeded no more deposits are accepted. None for uncapped total supply.
 *   * `maximal_total_debt` - maximal allowed total debt, If exceeded no more borrows are accepted. None for uncapped total debt.
 *   * `minimal_collateral` - the required minimal deposit of the asset by user to turn asset to be collateral.
 *   * `minimal_debt` - the minimal possible debt that can be taken by user.
 *   * `income_for_suppliers_part_e6` - indicates which part of an income should suppliers be paid - in E6 notation (multiplied by 10^6)
 *   * `flash_loan_fee_e6` - fee (percentage) to charge for taking a flash loan for this asset - in E6 notation (multiplied by 10^6)
 *   * `a_token_address` - `AccountId` of the asset's already deployed `AToken`
 *   * `v_token_address` - `AccountId` of the asset's already deployed `VToken`
 */
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
  flashLoanFeeE6: bigint;
  aTokenAddress: AccountId;
  vTokenAddress: AccountId;
}

export interface Message_LendingPoolManage_set_block_timestamp_provider {
  __kind: 'LendingPoolManage_set_block_timestamp_provider';
  providerAddress: AccountId;
}

/**
 *   activates or disactivates reserv
 *
 *   * `active` - true if reserve should be activated. flase if reserve should be disactivated. When disactivated all actions on the reserve are disabled.
 */
export interface Message_LendingPoolManage_set_reserve_is_active {
  __kind: 'LendingPoolManage_set_reserve_is_active';
  asset: AccountId;
  active: boolean;
}

/**
 *   freezes or unfreezes reserv
 *
 *   * `freeze` - true if reserve should be freezed. flase if reserve should be unffreeze. When freezed supplying and borrowing are disabled.
 */
export interface Message_LendingPoolManage_set_reserve_is_freezed {
  __kind: 'LendingPoolManage_set_reserve_is_freezed';
  asset: AccountId;
  freeze: boolean;
}

/**
 *  modifies reserve in the `LendingPool`'s storage
 *
 *   * `asset` - `AccountId` of the registered asset
 *   * `maximal_total_supply` - maximal allowed total supply, If exceeded no more deposits are accepted. None for uncapped total supply.
 *   * `maximal_total_debt` - maximal allowed total debt, If exceeded no more borrows are accepted. None for uncapped total debt.
 *   * `minimal_collateral` - the required minimal deposit of the asset by user to turn asset to be collateral.
 *   * `minimal_debt` - the minimal possible debt that can be taken by user.
 *   * `income_for_suppliers_part_e6` - indicates which part of an income should suppliers be paid - in E6 notation (multiplied by 10^6)
 *   * `flash_loan_fee_e6` - fee (percentage) to charge for taking a flash loan for this asset - in E6 notation (multiplied by 10^6)
 */
export interface Message_LendingPoolManage_set_reserve_parameters {
  __kind: 'LendingPoolManage_set_reserve_parameters';
  asset: AccountId;
  interestRateModel: SetReserveParametersInput2;
  maximalTotalSupply?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
  incomeForSuppliersPartE6: bigint;
  flashLoanFeeE6: bigint;
}

export interface Message_LendingPoolManage_take_protocol_income {
  __kind: 'LendingPoolManage_take_protocol_income';
  assets?: AccountId[] | undefined;
  to: AccountId;
}

/**
 *  Returns LendingPool's total variable debt of users in the context of an underlying asset.
 *
 *  * `underlying_asset` - AccountId (aka address) of an asset to look up total variable debt of.
 */
export interface Message_LendingPoolVTokenInterface_total_variable_debt_of {
  __kind: 'LendingPoolVTokenInterface_total_variable_debt_of';
  underlyingAsset: AccountId;
}

/**
 *  Transfers an `amount` of variable debt on the behalf of `from` to the account `to` in the context of an `underlying_asset`.
 *
 *  * `underlying_asset` - AccountId (aka address) of an asset to transfer variable debt from/to.
 *  * `from` - AccountId (aka address) of an user to transfer from.
 *  * `to` - AccountId (aka address) of an user to transfer to.
 *
 *  On success a number of PSP22's `Transfer` events are emitted.
 *  The number of events and their type/values depend on the interests that may be accrued both for `from` and `to` accounts.
 *
 *  # Errors
 *
 *  Returns `TransfersDisabled` error if deposit for given `underlying_asset` is disabled.
 *
 *  Returns `WrongCaller` error if the caller is not an `underlying_asset`'s VToken contract.
 *
 *  Returns `InsufficientBalance` error if there are not enough tokens on
 *  the the account Balance of `from`.
 */
export interface Message_LendingPoolVTokenInterface_transfer_variable_debt_from_to {
  __kind: 'LendingPoolVTokenInterface_transfer_variable_debt_from_to';
  underlyingAsset: AccountId;
  from: AccountId;
  to: AccountId;
  amount: bigint;
}

/**
 *  Returns the specified `user`'s variable debt in the context of an `underlying_asset`.
 *
 *  * `underlying_asset` - AccountId (aka address) of an asset to look up user's variable debt of.
 *  * `user` - AccountId (aka address) of an user to look up variable debt for.
 */
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

export interface Message_LendingPoolView_view_market_rule {
  __kind: 'LendingPoolView_view_market_rule';
  marketRuleId: bigint;
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

export interface Message_LendingPoolView_view_reserve_datas {
  __kind: 'LendingPoolView_view_reserve_datas';
  assets?: AccountId[] | undefined;
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

export interface Message_LendingPoolView_view_user_reserve_datas {
  __kind: 'LendingPoolView_view_user_reserve_datas';
  assets?: AccountId[] | undefined;
  account: AccountId;
}

/**
 *  Returns true if the contract is paused, and false otherwise.
 */
export interface Message_Pausable_paused {
  __kind: 'Pausable_paused';
}

export interface Message_pause {
  __kind: 'pause';
}

export interface Message_unpause {
  __kind: 'unpause';
}

export type Event =
  | Event_AssetRegistered
  | Event_AssetRulesChanged
  | Event_BorrowVariable
  | Event_CollateralSet
  | Event_Deposit
  | Event_FlashLoan
  | Event_IncomeTaken
  | Event_InterestsAccumulated
  | Event_LiquidateVariable
  | Event_MarketRuleChosen
  | Event_ParametersChanged
  | Event_RateRebalanced
  | Event_Redeem
  | Event_RepayVariable
  | Event_ReserveActivated
  | Event_ReserveFreezed
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
  marketRuleId: bigint;
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
  set: boolean;
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

export interface Event_IncomeTaken {
  __kind: 'IncomeTaken';
  asset: AccountId;
}

export interface Event_InterestsAccumulated {
  __kind: 'InterestsAccumulated';
  asset: AccountId;
}

export interface Event_LiquidateVariable {
  __kind: 'LiquidateVariable';
  liquidator: AccountId;
  user: AccountId;
  assetToRapay: AccountId;
  assetToTake: AccountId;
  amountRepaid: bigint;
  amountTaken: bigint;
}

export interface Event_MarketRuleChosen {
  __kind: 'MarketRuleChosen';
  user: AccountId;
  marketRuleId: bigint;
}

export interface Event_ParametersChanged {
  __kind: 'ParametersChanged';
  asset: AccountId;
  interestRateModel: SetReserveParametersInput2;
  maximalTotalSupply?: bigint | undefined;
  maximalTotalDebt?: bigint | undefined;
  minimalCollateral: bigint;
  minimalDebt: bigint;
  incomeForSuppliersPartE6: bigint;
  flashLoanFeeE6: bigint;
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
  active: boolean;
}

export interface Event_ReserveFreezed {
  __kind: 'ReserveFreezed';
  asset: AccountId;
  freezed: boolean;
}

export interface Event_UserInterestsAccumulated {
  __kind: 'UserInterestsAccumulated';
  asset: AccountId;
  user: AccountId;
}

export type Result<T, E> = { __kind: 'Ok'; value: T } | { __kind: 'Err'; value: E };
