use crate::{USERS, PROVIDERS, AppointmentDetails, ProviderRequests, ProviderRequest};
use ic_cdk::{query, update};
use candid::Principal;
use serde_json;

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
fn make_appointment(provider_id: String, department_name: String, doctor_name: String, date: String, time: String) -> Result <(), String>{
    let appointment_available: bool = PROVIDERS.with(|providers| {
        let mut providers = providers.borrow_mut();
        if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Provider not found")){
            if let Some(department) = provider_data.departments.get_mut(&department_name){
                if let Some(doctor) = department.get_mut(&doctor_name){
                    if let Some(selected_date) = doctor.get_mut(&date){
                        if let Some(index) = selected_date.iter().position(|t| t == &time) {
                            // Remove appointment if date available.
                            selected_date.remove(index);
                            true
                        } else {
                            false // Time slot not found.
                        }
                    }
                    else {
                        false
                    }
                }
                else {
                    false
                }
            }
            else {
                false
            }
        }
        else{
            false
        }
    });

    if appointment_available{
        USERS.with(|users|
        {
            let mut users = users.borrow_mut(); // Find user id with the ic_cdk caller principal id.
            // Add the appointment which we checked above if it exists.
            match users.get_mut(&ic_cdk::caller()) {
                Some(user) => {
                    let appointment_details = AppointmentDetails {
                        department: department_name.clone(),
                        doctor: doctor_name.clone(),
                        date: date.clone(),
                        time: time.clone(),
                    };

                    if let Some(appointments) = user.appointments.get_mut(&Principal::from_text(provider_id.clone()).expect("Provider id not found")) {
                        // Provider ID exists in the user's appointments hashmap
                        appointments.push(appointment_details);
                    } else {
                        // Provider ID does not exist, insert a new vector
                        user.appointments.insert(Principal::from_text(provider_id.clone()).expect("Provider id not found"), vec![appointment_details]);
                    }                   
                    Ok(())
                }
                None => Err("User not found".to_string())
            }
        }
        )
    }
    else {
        Err("No appointment available with desired info".to_string())
    }
}

#[query]
fn list_appointments(user_id: String) -> Vec<Vec<String>> {
    USERS.with(|users| {
        let users = users.borrow();
        if let Some(user) = users.get(&Principal::from_text(&user_id).expect("Not found user")) {
            let mut appointments = Vec::new();
            for (provider_id, appointment_details) in user.appointments.iter() {
                let mut appointment_info = Vec::new();
                for details in appointment_details {
                    let detail_str = format!("Provider ID: {}, Department: {}, Doctor: {}, Date: {}, Time: {}",
                                             provider_id,
                                             details.department,
                                             details.doctor,
                                             details.date,
                                             details.time);
                    appointment_info.push(detail_str);
                }
                appointments.push(appointment_info);
            }
            appointments // Return vector of vectors of strings
        } else {
            Vec::new() // Return an empty vector if the user is not found
        }
    })
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
            });
            Some(user_json.to_string())
        } else {
            None
        }
    })
}

#[update]
fn edit_user_personal_data(user_id: String, name: String, surname: String, birthday: String, country: String, city: String, province: String, mail: String, phone: String ) -> Result<(), String> {
    USERS.with(|users| {
        let mut users = users.borrow_mut();
        if let Some(user) = users.get_mut(&Principal::from_text(&user_id).expect("User not found.")) {
            let personal_data = &mut user.personal_data;

            personal_data.name = name;
            personal_data.surname = surname;
            personal_data.birthday = birthday;
            personal_data.country = country;
            personal_data.city = city;
            personal_data.province = province;
            personal_data.mail = mail;
            personal_data.phone = phone;
            Ok(()) 
        } else {
            Err("User not found, editing personal data failed.".to_string())
        }
    })
}