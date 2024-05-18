use crate::{USERS, PROVIDERS, Doctor};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

// Search doctor_id'in User object, if user exists Add it to providers doctors.
#[update]
fn add_doctor(provider_id: String, user_id: String, doctor_name: String, department_name: String) -> Result<(), String> {
    USERS.with(|user| {
        let mut user = user.borrow_mut();
        if let Some(new_doctor) = user.get_mut(&Principal::from_text(&user_id).expect("User not found.")) {
            PROVIDERS.with(|provider| {
                let mut provider = provider.borrow_mut();
                if let Some(provider) = provider.get_mut(&Principal::from_text(&provider_id).expect("Wrong Provider ID.")) {
                    if let Some(department) = provider.departments.get_mut(&department_name) {
                        let new_doctor_data = Doctor {
                            doctor_name: doctor_name.clone(),
                            doctor_department: department_name.clone(),
                            dates: HashMap::new(),
                        };
                        department.doctors.insert(user_id.clone(), new_doctor_data);
                        return Ok(());
                    }
                }
                Err("Failed to add doctor: Department not found.".to_string())
            })
        } else {
            Err("Failed to add doctor: User not found.".to_string())
        }
    })
}

#[query]
fn list_doctors(provider_id: String, department_name: String) -> Vec<Doctor> {
    PROVIDERS.with(|provider| {
        let provider = provider.borrow();
        if let Some(provider) = provider.get(&Principal::from_text(&provider_id).expect("Wrong Provider ID.")) {
            if let Some(department) = provider.departments.get(&department_name) {
                return department.doctors.values().cloned().collect();
            }
        }
        Vec::new() // Eğer sağlayıcı veya bölüm bulunamazsa boş bir vektör döndürür
    })
}