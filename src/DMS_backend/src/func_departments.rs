use crate::{PROVIDERS, Department};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

#[update]
fn add_department(provider_id: String, new_department_name: String) -> Result<(), String> {
    PROVIDERS.with(|providers| {
        let mut providers = providers.borrow_mut();
        if let Some(provider_data) = providers.get_mut(&Principal::from_text(&provider_id).expect("Provider not found")) {
            let new_department = Department {
                department_name: new_department_name.clone(),
                doctors: Default::default(),
            };
            provider_data.departments.insert(new_department_name.clone(), new_department);
            return Ok(());
        } else {
            return Err("Provider not found.".to_string());
        }
    })
}

#[query]
fn list_departments(provider_id: String) -> Result<Vec<Department>, String> {
    PROVIDERS.with(|providers| {
        let providers = providers.borrow();
        if let Some(provider) = providers.get(&Principal::from_text(&provider_id).expect("Provider not found")) {
            let departments: Vec<Department> = provider.departments.values().cloned().collect();
            Ok(departments)
        } else {
            Err("Provider not found.".to_string())
        }
    })
}