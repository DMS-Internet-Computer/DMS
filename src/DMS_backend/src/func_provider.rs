use crate::{PROVIDERS, Provider};
use ic_cdk::{query, update};
use candid::Principal;

#[query]
fn list_providers() -> Vec<Provider> {
    PROVIDERS.with(|providers| {
        let providers = providers.borrow();
        providers.values().cloned().collect()
    })
}

