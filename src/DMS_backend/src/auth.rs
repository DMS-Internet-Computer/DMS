use crate::{ACTIVE_SESSIONS, USERS, User, Session, HealthData, PersonalData};
use ic_cdk::{update};
use std::collections::HashMap;
use candid::Principal;
// #[update]
// fn sign_up(username: String, password: String) -> Result<(), String> {
//     if username.is_empty() || password.is_empty() {
//         return Err("Username or password cannot be empty".to_string());
//     }

//     //One Principal should Create only 1 account on system
//     if USERS.with(|users| users.borrow().contains_key(&ic_cdk::caller())) {
//         return Err("User already exists".to_string());
//     };

//     // // Principals can create multiple accounts on system with different user credentials
//     // if USERS.with(|users| users.borrow().values().any(|user| user.username == username)) {
//     //     return Err("User already exists".to_string());
//     // }


//     let new_user_id = ic_cdk::caller();
//     let new_user_credentials = User {
//         identity: new_user_id.to_string(),
//         username: username.to_string(),
//         password: password.to_string(),
//         appointments: HashMap::new(),
//         health_data: HealthData {allergies: Vec::new(), diseases: Vec::new(), medications: HashMap::new()},
//         personal_data: PersonalData{name: "".to_string(), surname: "".to_string() , age: "".to_string(), height: "".to_string(), weight: "".to_string(), location: "".to_string()},
//     };

//     USERS.with(|users| users.borrow_mut().insert(new_user_id, new_user_credentials));
//     Ok(())
// }

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

// #[update]
// fn login(identity: Principal) -> Result<(), String> {
//     if USERS.with(|users| users.borrow().is_empty()) {
//         return Err("No users exist".to_string());
//     }

//     let user_exists = USERS.with(|users| {
//         users.borrow().values().any(|user| user.username == username && user.password == password)
//     });

//     if !user_exists {
//         return Err("Wrong user credentials".to_string());
//     }

//     if ACTIVE_SESSIONS.with(|sessions| sessions.borrow().iter().any(|session| session.user_id == ic_cdk::caller())) {
//         return Err("User already logged in".to_string());
//     }

//     let user_id = ic_cdk::caller();
//     ACTIVE_SESSIONS.with(|sessions| {
//         sessions.borrow_mut().push(Session { user_id });
//     });

//     Ok(())
// }

// #[update]
// fn login(username: String, password: String) -> Result<(), String> {
//     if USERS.with(|users| users.borrow().is_empty()) {
//         return Err("No users exist".to_string());
//     }

//     let user_exists = USERS.with(|users| {
//         users.borrow().values().any(|user| user.username == username && user.password == password)
//     });

//     if !user_exists {
//         return Err("Wrong user credentials".to_string());
//     }

//     if ACTIVE_SESSIONS.with(|sessions| sessions.borrow().iter().any(|session| session.user_id == ic_cdk::caller())) {
//         return Err("User already logged in".to_string());
//     }

//     let user_id = ic_cdk::caller();
//     ACTIVE_SESSIONS.with(|sessions| {
//         sessions.borrow_mut().push(Session { user_id });
//     });

//     Ok(())
// }

// Log Out Function
#[update]
fn logout() {
    let user_id = ic_cdk::caller();
    ACTIVE_SESSIONS.with(|sessions| {
        sessions.borrow_mut().retain(|session| session.user_id != user_id);
    });
}