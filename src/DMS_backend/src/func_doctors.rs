use crate::{USERS, PROVIDERS, Doctor};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

#[update]
fn add_doctor(provider_id: String, doctor_id: String, new_doctor_name: String, new_doctor_department: String) -> Result<(), String>{
    USERS.with(|user| {
        let mut mut_user = user.borrow_mut();
        if let Some(mut user) = mut_user.get_mut(&Principal::from_text(&doctor_id.clone()).expect("Doctor user not exist."))
        {
            PROVIDERS.with(
                |provider| 
                {
                    let mut mut_provider = provider.borrow_mut();
                    if let Some(mut current_provider) = mut_provider.get_mut(&Principal::from_text(&provider_id.clone()).expect("Provider not found"))
                    {
                        if let Some(mut current_department) = current_provider.departments.get_mut(&new_doctor_department.clone())
                        {
                            let new_doctor = Doctor {
                            doctor_provider: provider_id.clone(),
                            doctor_id: doctor_id.clone(),
                            doctor_name: new_doctor_name.clone(),
                            doctor_department: new_doctor_department.clone(),
                            schedule: Vec::new(),
                            };
                            current_department.doctors.insert(doctor_id.clone(), new_doctor);
                            user.user_owner = provider_id.clone();
                            user.user_owner_department = new_doctor_department.clone();
                            user.user_type = 2;
                            Ok(())
                        }
                        else {
                            Err("Could not found Department.".to_string())
        
                        }
                    }
                    else {
                        Err("Adding doctor failed.".to_string())
                    }
                }
            )
        }
        else {
                Err("Adding doctor failed.".to_string())
        }
    })
}

#[query]
fn get_current_doctor(provider_id: String, department_name: String, doctor_id: String) -> Option<Doctor> {
    PROVIDERS.with(|providers| {
        let providers = providers.borrow();
        let provider = providers.get(&Principal::from_text(&provider_id.clone()).expect("Provider not found"))?;
        let department = provider.departments.get(&department_name)?;
        let doctor = department.doctors.get(&doctor_id)?;
        Some(doctor.clone())
    })
}

#[query]
fn list_doctors(provider_id: String) -> Vec<Doctor>{
    PROVIDERS.with(
        |provider|
        {
            let temp_provider = provider.borrow();
            if let Some(current_provider) = temp_provider.get(&Principal::from_text(&provider_id.clone()).expect("Provider not found")){
                let mut doctors = Vec::new();
                for department in current_provider.departments.values(){
                    for doctor in department.doctors.values(){
                        doctors.push(doctor.clone())
                    }
                }
                return doctors;
            }
            return Vec::new();
        }
    )
}

#[query]
fn list_department_doctors(provider_id: String, department_name: String) -> Vec<Doctor>
{
    PROVIDERS.with(
        |provider|
        {
            let temp_provider = provider.borrow();
            if let Some(current_provider) = temp_provider.get(&Principal::from_text(&provider_id.clone()).expect("Provider not found")){
                let mut doctors = Vec::new();
                if let Some(current_deparment) = current_provider.departments.get(&department_name.clone())
                {
                    for doctor in current_deparment.doctors.values()
                    {
                        doctors.push(doctor.clone());
                    }
                    return doctors;
                }
                else
                {
                    return Vec::new();
                }
            }
            return Vec::new();
        }
    )
}
