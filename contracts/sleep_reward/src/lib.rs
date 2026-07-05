#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    Balance(Address),
    Stake(Address),
}

const STAKING_MULTIPLIER_THRESHOLD: i128 = 1000;

#[contract]
pub struct SleepRewardToken;

#[contractimpl]
impl SleepRewardToken {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("already initialized");
        }
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();

        if amount < 0 {
            panic!("negative amount");
        }

        let staked: i128 = env.storage().persistent().get(&DataKey::Stake(to.clone())).unwrap_or(0);
        let multiplier = 1 + (staked / STAKING_MULTIPLIER_THRESHOLD);
        let final_amount = amount * multiplier;

        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(to.clone())).unwrap_or(0);
        balance += final_amount;
        env.storage().persistent().set(&DataKey::Balance(to), &balance);
    }

    pub fn balance(env: Env, id: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Balance(id)).unwrap_or(0)
    }

    pub fn stake(env: Env, from: Address, amount: i128) {
        from.require_auth();
        if amount <= 0 {
            panic!("invalid amount");
        }
        
        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(from.clone())).unwrap_or(0);
        if balance < amount {
            panic!("insufficient balance");
        }
        balance -= amount;
        env.storage().persistent().set(&DataKey::Balance(from.clone()), &balance);

        let mut staked: i128 = env.storage().persistent().get(&DataKey::Stake(from.clone())).unwrap_or(0);
        staked += amount;
        env.storage().persistent().set(&DataKey::Stake(from.clone()), &staked);
    }

    pub fn unstake(env: Env, from: Address, amount: i128) {
        from.require_auth();
        if amount <= 0 {
            panic!("invalid amount");
        }
        
        let mut staked: i128 = env.storage().persistent().get(&DataKey::Stake(from.clone())).unwrap_or(0);
        if staked < amount {
            panic!("insufficient staked balance");
        }
        staked -= amount;
        env.storage().persistent().set(&DataKey::Stake(from.clone()), &staked);

        let mut balance: i128 = env.storage().persistent().get(&DataKey::Balance(from.clone())).unwrap_or(0);
        balance += amount;
        env.storage().persistent().set(&DataKey::Balance(from), &balance);
    }

    pub fn staked_balance(env: Env, id: Address) -> i128 {
        env.storage().persistent().get(&DataKey::Stake(id)).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::Env;

    #[test]
    fn test_mint_and_stake() {
        let env = Env::default();
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        env.mock_all_auths();

        let contract_id = env.register(SleepRewardToken, ());
        let client = SleepRewardTokenClient::new(&env, &contract_id);

        client.initialize(&admin);
        
        // Mint initial
        client.mint(&user, &2000);
        assert_eq!(client.balance(&user), 2000);

        // Stake 1000
        client.stake(&user, &1000);
        assert_eq!(client.balance(&user), 1000);
        assert_eq!(client.staked_balance(&user), 1000);

        // Mint again with 1x extra multiplier
        client.mint(&user, &500);
        // 500 * (1 + 1000/1000) = 1000
        assert_eq!(client.balance(&user), 2000); // 1000 previous + 1000 new
        assert_eq!(client.staked_balance(&user), 1000);
    }
}
