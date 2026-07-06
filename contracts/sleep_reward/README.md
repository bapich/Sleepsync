# Sleep Reward Token Contract

This Soroban smart contract implements the `SLEEP` token used for SleepSync rewards.

## Features

- **Minting**: Authorized admins (or the `sleep_sync` contract itself) can mint `SLEEP` tokens directly to a user's address.
- **Balances**: Native balance tracking on Soroban without needing full SAC integration for this MVP.
- **Staking Pool**: Users can lock their `SLEEP` tokens in the contract.
- **Reward Multipliers**: Holding staked tokens automatically multiplies any incoming minted rewards, incentivizing long-term hodling of SLEEP.

## Design

This is designed to be cross-called by the main `sleep_sync` contract when a user hits their weekly sleep targets.
