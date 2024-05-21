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
                    picture: Vec::new(),
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


#[update]
fn update_user_profile(
    identity: String,
    name: String,
    surname: String,
    birthday: String,
    country: String,
    city: String,
    province: String,
    mail: String,
    phone: String,
    height: String,
    weight: String,
    blood_type: String,
) -> Result<(), String> {
    USERS.with(|users| {
        let mut mut_users = users.borrow_mut();
        if let Some(user) = mut_users.get_mut(&Principal::from_text(&identity).expect("User not found")) {
            user.personal_data.name = name;
            user.personal_data.surname = surname;
            user.personal_data.birthday = birthday;
            user.personal_data.country = country;
            user.personal_data.city = city;
            user.personal_data.province = province;
            user.personal_data.mail = mail;
            user.personal_data.phone = phone;
            user.health_data.height = height;
            user.health_data.weight = weight;
            user.health_data.blood_type = blood_type;
            Ok(())
        } else {
            Err("update failed.".to_string())
        }
    })
}

#[update]
fn update_user_picture(
    identity: String, 
    picture: Vec<u8>
) -> Result<(), String> 
{
    USERS.with(|users| {
        let mut mut_users = users.borrow_mut();
        if let Some(user) = mut_users.get_mut(&Principal::from_text(&identity).expect("User not found")) {
            user.personal_data.picture = picture;
            Ok(())
        } else {
            Err("update failed.".to_string())
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