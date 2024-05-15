use crate::{PROVIDERS, USERS, Medication, Department};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

// PROVIDERS -> 
// Providers HashMap<Principal, Provider> 
// Provider : Struct { Provider Name, Provider Password, Departments: }
// Departments : HashMap<Department Name: String, Doctors>
// Doctors : HashMap<Doctors Name: String, Dates>
// Dates: HashMap<Selected Date: String, Times>
// Times: Vec<String>;

// List Departments will do select an provider from PROVIDERS with desired provider ID.

// #[query]
// fn list_departments(provider_id: String) -> Vec<String> {
//     PROVIDERS.with(|providers| {
//         let provider = providers.borrow();
//         provider
//             .get(&Principal::from_text(&provider_id.clone()).expect("Provider not found"))
//             .map(|provider| provider.departments.keys().cloned().collect())
//             .unwrap_or_else(|| {
//                 panic!("Provider with id {} not found", provider_id);
//             })
//     })
// }

#[update]
fn add_department(provider_id: String, department_name: String) -> Result<(), String> {
    PROVIDERS.with(|providers| {
        let mut providers = providers.borrow_mut();
        if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Provider not found")) {
            let new_department = Department {
                department_name: department_name.clone(),
                doctors: Default::default(),
            };

            provider_data.departments.insert(department_name, new_department);

            return Ok(());
        } else {
            return Err("Provider not found.".to_string());
        }
    })
}


#[query]
fn list_providers() -> Vec<String> {
    PROVIDERS.with(|providers| {
        let providers = providers.borrow();
        providers.keys().map(|principal| principal.to_text()).collect()
    })
}

#[query]
fn list_departments(provider_id: String) -> Result<Vec<String>, String> {
    PROVIDERS.with(|providers| {
        let providers = providers.borrow();
        if let Some(provider) = providers.get(&Principal::from_text(&provider_id).expect("Provider not found")) {
            let departments = provider.departments.keys().cloned().collect();
            Ok(departments)
        } else {
            Err("Provider not found.".to_string())
        }
    })
}
// #[query]
// fn list_doctors(provider_id: String, department_name: String) -> Vec<String> {
//     PROVIDERS.with(|providers| {
//         let provider = providers.borrow();
//         if let Some(provider_data) = provider.get(&Principal::from_text(&provider_id).expect("Provider not found")) {
//             if let Some(department) = provider_data.departments.get(&department_name) {
//                 return department.keys().cloned().collect();
//             }
//         }
//         Vec::new()
//     })
// }

// #[update]
// fn add_doctor(provider_id: String, department_name: String, doctor_name: String) -> Result<(), String>{
//     PROVIDERS.with(|providers| {
//         let mut providers = providers.borrow_mut();
//         if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Provider not found")){
//             if let Some(department) = provider_data.departments.get_mut(&department_name){
//                 let doctors_content = HashMap::new(); 
//                 department.insert(doctor_name, doctors_content);
//                 Ok(())
//             }
//             else {
//                 Err("Department not found".to_string())
//             }
//         }
//         else{
//             Err("Couldn't add doctor.".to_string())
//         }
//     })
// }

// #[query]
// fn list_dates(provider_id: String, department_name: String, doctors_name: String) -> Vec<String> {
//     PROVIDERS.with(|providers| {
//         let provider = providers.borrow();
//         if let Some(provider_data) = provider.get(&Principal::from_text(&provider_id).expect("Provider not found")) {
//             if let Some(department) = provider_data.departments.get(&department_name) {
//                 if let Some(doctor) = department.get(&doctors_name) {
//                     // Collect all dates from the doctor's Dates hashmap
//                     let mut all_dates = Vec::new();
//                     for (date, _) in doctor.iter() {
//                         all_dates.push(date.clone());
//                     }
//                     return all_dates;
//                 }
//             }
//         }
//         Vec::new()
//     })
// }

// #[update]
// fn add_date(provider_id: String, department_name: String, doctor_name: String, date: String) -> Result <(), String>{
//     PROVIDERS.with(|providers| {
//         let mut providers = providers.borrow_mut();
//         if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Provider not found")){
//             if let Some(department) = provider_data.departments.get_mut(&department_name){
//                 if let Some(doctor) = department.get_mut(&doctor_name){
//                     let date_content = Vec::new();
//                     doctor.insert(date, date_content);
//                     Ok(())
//                 }
//                 else{
//                     Err("Can't find doctor".to_string())
//                 }
//             }
//             else{
//                 Err("Can't find department".to_string())
//             }
//         }
//         else{
//             Err("Adding date failed".to_string())
//         }
//     })
// }

// #[query]
// fn list_times(provider_id: String, department_name: String, doctors_name: String, selected_date: String) -> Vec<String> {
//     PROVIDERS.with(|providers| {
//         let provider = providers.borrow();
//         if let Some(provider_data) = provider.get(&Principal::from_text(&provider_id).expect("Provider not found")) {
//             if let Some(department) = provider_data.departments.get(&department_name) {
//                 if let Some(doctor) = department.get(&doctors_name) {
//                     if let Some(date) = doctor.get(&selected_date) {
//                         let mut all_times = Vec::new();
//                         for time in date.iter() {
//                             all_times.push(time.clone());
//                         }
//                         return all_times;
//                     }
//                 }
//             }
//         }
//         Vec::new() 
//     })
// }


// #[update]
// fn add_time(provider_id: String, department_name: String, doctor_name: String, date: String, time: String) -> Result <(), String>{
//     PROVIDERS.with(|providers| {
//         let mut providers = providers.borrow_mut();
//         if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Provider not found")) {
//             if let Some(department) = provider_data.departments.get_mut(&department_name){
//                 if let Some(doctor) = department.get_mut(&doctor_name){
//                     if let Some(times) = doctor.get_mut(&date){
//                         times.push(time.clone());
//                         Ok(())
//                     }
//                     else{
//                         return Err("Date not found".to_string());
//                     }
//                 }
//                 else {
//                     return Err("Doctor not found".to_string());
//                 }
//             }
//             else{
//                 return Err("Department not found".to_string());
//             }
//         }
//         else {
//             return Err("Provider not found".to_string());
//         }
//     })
// }

// #[query]
// fn get_patient_info(patient_id: String) -> Option<String> {
//     USERS.with(|users| {
//         let users = users.borrow();
//         if let Some(user) = users.get(&Principal::from_text(&patient_id).expect("User not found.")) {
//             // Converts user data to JSON object
//             let user_json = serde_json::json!({
//                 "identity": user.identity,
//                 "username": user.username,
//                 "password": user.password,
//                 "appointments": user.appointments,
//                 "health_data": user.health_data,
//                 "personal_data": user.personal_data,
//             });
//             Some(user_json.to_string())
//         } else {
//             None
//         }
//     })
// }

#[query]
fn get_provider_info(provider_id: String) -> Option<String> {
    PROVIDERS.with(|providers| {
        let providers = providers.borrow();
        if let Some(provider) = providers.get(&Principal::from_text(&provider_id).expect("Provider not found.")) {
            // Converts provider data to JSON object
            let provider_json = serde_json::json!({
                "provider_name": provider.provider_name,
                "provider_location": provider.provider_location,
                "departments": provider.departments,
            });
            Some(provider_json.to_string())
        } else {
            None
        }
    })
}

#[update]
fn edit_provider_info(provider_id: String, provider_name: String, provider_location: String) -> Result<(), String>{
    PROVIDERS.with(|providers| {
        let mut providers = providers.borrow_mut();
        if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Profider not found.")){
            provider_data.provider_name = provider_name.clone();
            provider_data.provider_location = provider_location.clone();
            Ok(())
        }
        else{
            return Err("Provider not found.".to_string())
        }
    })
}

#[update]
fn add_disease(user_id: String, disease_name: String) -> Result<(), String>{
    USERS.with(|users| 
        {
            let mut users = users.borrow_mut();
            if let Some(user) = users.get_mut(&Principal::from_text(&user_id).expect("User not found."))
            {
                user.health_data.diseases.push(disease_name);
                Ok(())
            }
            else{
                Err("User not found.".to_string())
            }
        }
    )
}

#[update]
fn add_allergy(user_id: String, allergy_name: String) -> Result<(), String>{
    USERS.with(|users| 
        {
            let mut users = users.borrow_mut();
            if let Some(user) = users.get_mut(&Principal::from_text(&user_id).expect("User not found."))
            {
                user.health_data.allergies.push(allergy_name);
                Ok(())
            }
            else{
                Err("User not found.".to_string())
            }
        }
    )
}

#[update]
fn add_medication(user_id: String, barcode: String, prescription_date: String, prescription_number: String, medicine_name: String, dosage: String, period: String, usage_method: String, usage_count: String, box_count: String, provider_name: String, doctor_name: String, box_image: Vec<u8>, prospectus_pdf: Vec<u8>) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&Principal::from_text(&user_id).expect("User not found.")) {
            let medication = Medication {
                prescription_date: prescription_date, // Change this to actual prescription date
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
// #[update]
// fn add_medicine(user_id: String, medicine: String) -> Result<(), String>
// {

// }