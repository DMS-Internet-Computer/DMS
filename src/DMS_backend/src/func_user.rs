use crate::{USERS, ACTIVE_SESSIONS, Session, User, HealthData, PersonalData};
use ic_cdk::{query, update};
use candid::Principal;
use serde_json;
use std::collections::HashMap;

#[update]
fn create_user(identity: String) -> Result<(), String> {
    if let Ok(principal) = Principal::from_text(&identity) {
        if USERS.with(|users| users.borrow().contains_key(&principal)) {
               ACTIVE_SESSIONS.with(|sessions| {
        sessions.borrow_mut().push(Session { user_id: principal });
            }); 
            return Ok(());
        } else {
            let new_user_credentials = User {
                identity: identity,
                appointments: HashMap::new(),
                health_data: HealthData {
                    height: "".to_string(),
                    weight: "".to_string(),
                    blood_type: "".to_string(),
                    allergies: Vec::new(),
                    diseases: Vec::new(),
                    medications: HashMap::new()
                },
                personal_data: PersonalData {
                    name: "".to_string(),
                    surname: "".to_string(),
                    birthday: "".to_string(),
                    country: "".to_string(),
                    city: "".to_string(),
                    province: "".to_string(),
                    mail: "".to_string(),
                    phone: "".to_string(),
                },
                provider_requests: HashMap::new(),
                user_type: 0,
                
            };

            USERS.with(|users| users.borrow_mut().insert(principal.clone(), new_user_credentials));
            ACTIVE_SESSIONS.with(|sessions| {
                sessions.borrow_mut().push(Session { user_id: principal });
                    }); 
            return Ok(());
        }
    } else {
        return Err("Failed to parse principal".to_string());
    }
}

#[query]
fn get_current_user(identity: String) -> Option<String> {
    USERS.with(|users| {
        let users = users.borrow();
        if let Some(user) = users.get(&Principal::from_text(identity).expect("User not found")) {
            // Converts user data to JSON object
            let user_json = serde_json::json!({
                "identity": user.identity,
                "appointments": user.appointments,
                "health_data": user.health_data,
                "personal_data": user.personal_data,
                "provider_requests": user.provider_requests,
                "user_type": user.user_type,
            });
            Some(user_json.to_string())
        } else {
            None
        }
    })
}

#[query]
fn list_active_sessions() -> Vec<String> {
    ACTIVE_SESSIONS.with(|sessions| {
        sessions.borrow().iter().map(|session| session.user_id.to_string()).collect()
    })
}

#[update]
fn logout() {
    let user_id = ic_cdk::caller();
    ACTIVE_SESSIONS.with(|sessions| {
        sessions.borrow_mut().retain(|session| session.user_id != user_id);
    });
}