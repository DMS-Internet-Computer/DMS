use crate::{ACTIVE_SESSIONS, USERS, PROVIDERS, Provider};
use ic_cdk::{query, update};
use std::collections::HashMap;
use candid::Principal;
// Checking if a user is logged in
#[query]
fn is_logged_in(user_id: String) -> bool {
    ACTIVE_SESSIONS.with(|sessions| sessions.borrow().iter().any(|session| session.user_id.to_string() == user_id))
}

#[query]
fn is_provider() -> bool {
    PROVIDERS.with(|providers| {
        providers.borrow().contains_key(&ic_cdk::caller())
    })
}

// Listing signed users
// #[query]
// fn list_signed_users() -> Vec<String> {
//     USERS.with(|users| {
//         users.borrow().values().map(|user| user.username.clone()).collect()
//     })
// }

// Listing active sessions - to see online principals
#[query]
fn list_active_sessions() -> Vec<String> {
    ACTIVE_SESSIONS.with(|sessions| {
        sessions.borrow().iter().map(|session| session.user_id.to_string()).collect()
    })
}

// Takes user with provided user_id and makes it a provider with desired name and pass.
#[update]
fn set_provider(user_id: String) -> Result<(), String> {
    // Hash Map
    // Users<Principal, User{username, password}>
    // if !USERS.with(|users| users.borrow().contains_key(&Principal::from_text(user_id.clone()).expect("REASON"))) {
    //     return Err("User not found".to_string());
    // } 
    // 
    let provider_credentials = Provider {
        provider_name: user_id.clone(),
        provider_location: "".to_string(),
        departments: HashMap::new()
    };

    PROVIDERS.with(|providers| providers.borrow_mut().insert(Principal::from_text(user_id).expect("REASON"), provider_credentials));

    Ok(())
}

#[query]
fn list_providers() -> Vec<String> {
    PROVIDERS.with(|providers| {
        providers.borrow().values().map(|provider| provider.provider_name.clone()).collect()
    })
}

#[update]
fn remove_provider(user_id: String) -> Result<(), String> {
    // If Provider with desired user_id exists in PROVIDERS hashmap remove it from there.
    if PROVIDERS.with(|providers| providers.borrow_mut().remove(&Principal::from_text(&user_id).expect("REASON"))).is_some() {
        Ok(())
    } else {
        Err("Error: Provider not found".to_string())
    }
}