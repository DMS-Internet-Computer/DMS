use crate::{USERS, RadiologicalImage};
use ic_cdk::{query, update};
use candid::Principal;

#[update]
fn add_radiological_image(user_id: String, date: String, provider_name: String, doctor_name: String, explanation: String, report: Vec<u8>, image: Vec<u8>) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&Principal::from_text(&user_id).expect("User not found.")) {
            let radiological_image = RadiologicalImage {
                date,
                provider_name,
                doctor_name,
                explanation,
                report,
                image,
            };
            user.health_data.radiological_images.insert(user_id.clone(), radiological_image);
            Ok(())
        } else {
            Err("User not found.".to_string())
        }
    })
}

#[query]
fn list_radiological_images(user_id: String) -> Result<Vec<RadiologicalImage>, String> {
    USERS.with(|users| {
        let users = users.borrow();
        if let Some(user) = users.get(&Principal::from_text(&user_id).expect("User not found.")) {
            let radiological_images: Vec<RadiologicalImage> = user.health_data.radiological_images.values().cloned().collect();
            Ok(radiological_images)
        } else {
            Err("User not found.".to_string())
        }
    })
}
