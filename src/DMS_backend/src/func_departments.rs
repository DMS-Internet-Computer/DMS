use crate::{PROVIDERS, Department};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

#[update]
fn add_department(provider_id: String, new_department_name: String) -> Result<(), String> {
    PROVIDERS.with(
        |provider| {
            let mut mut_provider = provider.borrow_mut();
            if let Some(mut current_provider) = mut_provider.get_mut(&Principal::from_text(&provider_id.clone()).expect("Provider not found")){
                let new_department = Department {
                    department_name: new_department_name.clone(),
                    doctors: HashMap::new(),
                };
                current_provider.departments.insert(new_department_name.clone(), new_department);
                Ok(())
            }
            else{
                Err("Couldn't add department.".to_string())
            }
        }
    )
}

#[query]
fn list_departments(provider_id: String) -> Vec<Department> {
    PROVIDERS.with(
        |provider| {
            let temp_provider = provider.borrow();
            if let Some(current_provider) = temp_provider.get(&Principal::from_text(&provider_id.clone()).expect("Provider not found")){
                current_provider.departments.values().cloned().collect()
            }
            else{
                Vec::new()
            }
        }
    )
}