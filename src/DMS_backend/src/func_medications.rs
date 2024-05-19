use crate::{USERS, Medication};
use ic_cdk::{query, update};
use candid::Principal;

#[update]
fn add_medication(user_id: String, barcode: String, prescription_date: String, prescription_number: String, medicine_name: String, dosage: String, period: String, usage_method: String, usage_count: String, box_count: String, provider_name: String, doctor_name: String, box_image: Vec<u8>, prospectus_pdf: Vec<u8>) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&Principal::from_text(&user_id).expect("User not found.")) {
            let medication = Medication {
                prescription_date: prescription_date,
                barcode,
                prescription_number: prescription_number.clone(),
                medicine_name,
                dosage,
                period,
                usage_method,
                usage_count,
                box_count,
                provider_name,
                doctor_name,
                box_image,
                prospectus_pdf,
            };
            user.health_data.medications.insert(prescription_number, medication);
            Ok(())
        } else {
            Err("User not found.".to_string())
        }
    })
}

#[query]
fn list_medications(user_id: String) -> Result<Vec<Medication>, String> {
    USERS.with(|users| {
        let users = users.borrow();
        if let Some(user) = users.get(&Principal::from_text(&user_id).expect("User not found.")) {
            let medications: Vec<Medication> = user.health_data.medications.values().cloned().collect();
            Ok(medications)
        } else {
            Err("User not found.".to_string())
        }
    })
}