use crate::{PROVIDERS, DoctorAppointment};
use candid::Principal;
use ic_cdk::{query, update};

#[update]
fn create_appointment(provider_id: String, department_name: String, doctor_id: String, new_appointment_date: String, new_appointment_time: String) -> Result<(), String>
{
    PROVIDERS.with(
        |provider|
        {
            let mut mut_provider = provider.borrow_mut();
            
            if let Some(mut current_provider) = mut_provider.get_mut(&Principal::from_text(&provider_id.clone()).expect("Provider not found"))
            {
                if let Some(mut current_department) = current_provider.departments.get_mut(&department_name.clone())
                {
                    if let Some(mut current_doctor) = current_department.doctors.get_mut(&doctor_id.clone())
                    {
                        let new_appointment = DoctorAppointment {
                            patient_id: "".to_string(),
                            doctor_appointment_date: new_appointment_date.clone(),
                            doctor_appointment_time: new_appointment_time.clone(),
                            doctor_appointment_status: 0, // 0 pending as default, 1 finished, 2 cancel
                        };
                        if let Some(mut existed_schedule) = current_doctor.schedule.get_mut(&new_appointment_date.clone())
                        {
                            existed_schedule.push(new_appointment);
                            Ok(())
                        }
                        else 
                        {
                            current_doctor.schedule.insert(new_appointment_date.clone(), new_appointment);
                            Ok(())
                        }  
                    }
                    else 
                    {
                        Err("Doctor not found".to_string())
                    }
                }
                else
                {
                    Err("Department not found".to_string())
                }
            }
        }
    )
}

#[query]
fn list_appointments(provider_id: String, department_name: String, doctor_id: String) -> Vec<DoctorAppointment>{
    PROVIDERS.with(
        |provider|
        {
            let temp_provider = provider.borrow();
            if let Some(current_provider) = temp_provider.get(&Principal::from_text(&provider_id.clone()).expect("PNF"))
            {
                if let Some(current_department) = current_provider.departments.get(&department_name.clone())
                {
                    if let Some(current_doctor) = current_department.doctors.get(&doctor_id.clone())
                    {
                        current_doctor.schedule.values().cloned().collect()
                    }
                }
            }
            else
            {
                Vec::new()
            }
        }
    )
}

