use crate::{USERS, PROVIDERS, Provider, ProviderRequest};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

#[update]
fn create_provider_request(user_id: String, provider_name: String) -> Result<(), String>{
    let new_provider_request = ProviderRequest{
        provider_id: user_id.clone(),
        provider_name: provider_name,
        request_status: 0,
    };

    USERS.with(|users| {
        if let Some(user) = users.borrow_mut().get_mut(&Principal::from_text(&user_id.clone()).expect("User not found.")) {
            user.provider_requests.insert(user_id.clone(), new_provider_request);
            Ok(())
        } else {
            Err("User not found.".to_string())
        }
    })
    // If user with user_id exists take it.
    // Add the new provider_request with the inputs to its ProviderRequests 
}

#[query]
fn list_provider_requests() -> Vec<ProviderRequest> {
    USERS.with(|users| {
        users.borrow().values().flat_map(|user| {
            user.provider_requests.values().cloned()
        }).collect()
    })
}

#[update]
fn update_provider_request(user_id: String, new_request_status: u8) -> Result<(), String> {
    if new_request_status == 0 || new_request_status == 1 || new_request_status == 2 {
        USERS.with(|users| {
            if let Some(user) = users.borrow_mut().get_mut(&Principal::from_text(&user_id).expect("User not found.")) {
                if let Some(provider_request) = user.provider_requests.get_mut(&user_id) {
                    provider_request.request_status = new_request_status;
                    if new_request_status == 1
                    {
                        user.user_type = 1;
                        PROVIDERS.with(|providers| {
                            let new_provider = Provider {
                                provider_id: user_id.clone(),
                                provider_name: "".to_string(),
                                provider_location: "".to_string(),
                                departments: HashMap::new(),
                            };
                            providers.borrow_mut().insert(Principal::from_text(&user_id).expect("User not found."), new_provider);
                        })
                    }
                    Ok(())
                } else {
                    Err("Provider request not found.".to_string())
                }
            } else {
                Err("User not found.".to_string())
            }
        })
    } else {
        Err("Incorrect request status".to_string())
    }
}