use crate::{USERS, PROVIDERS, AppointmentDetails, DoctorAppointment};
use ic_cdk::{query, update};
use candid::Principal;
use std::collections::HashMap;

#[update]
fn schedule_appointment(
    provider_id: String, 
    department_name: String, 
    doctor_id: String, 
    appointment_date: String, 
    appointment_time: String, 
    patient_id: String // Kullanıcı kimliği
) -> Result<(), String> {
    PROVIDERS.with(|provider| {
        let mut mut_provider = provider.borrow_mut();

        if let Some(current_provider) = mut_provider.get_mut(&Principal::from_text(&provider_id.clone()).expect("Provider not found")) {
            if let Some(current_department) = current_provider.departments.get_mut(&department_name.clone()) {
                if let Some(current_doctor) = current_department.doctors.get_mut(&doctor_id.clone()) {
                    for appointment in current_doctor.schedule.iter_mut() {
                        if appointment.doctor_appointment_date == appointment_date && appointment.doctor_appointment_time == appointment_time {

                            if appointment.doctor_appointment_status == 0 { // 0: Pending
                                appointment.patient_id = patient_id.clone();
                                appointment.doctor_appointment_status = 1; // 1: Confirmed

                                return USERS.with(|users| {
                                    let mut mut_users = users.borrow_mut();
                                    if let Some(user) = mut_users.get_mut(&Principal::from_text(&patient_id.clone()).expect("User not found.")) {
                                        let new_appointment = AppointmentDetails {
                                            appointment_provider: provider_id.clone(),
                                            appointment_department: department_name.clone(),
                                            appointment_doctor: doctor_id.clone(),
                                            appointment_date: appointment_date.clone(),
                                            appointment_time: appointment_time.clone(),
                                        };
                                        user.appointments.entry(Principal::from_text(&patient_id.clone()).expect("Failed.")).or_insert(vec![]).push(new_appointment);
                                        Ok(())
                                    } else {
                                        Err("User not found.".to_string())
                                    }
                                });
                            } else {
                                return Err("Appointment is not available.".to_string());
                            }
                        }
                    }
                    Err("Appointment not found.".to_string())
                } else {
                    Err("Doctor not found.".to_string())
                }
            } else {
                Err("Department not found.".to_string())
            }
        } else {
            Err("Provider not found.".to_string())
        }
    })
}