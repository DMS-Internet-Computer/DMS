mod func_user;
mod func_provider;
mod func_medications;
mod func_departments;
mod func_doctors;
mod func_doctor_appointment;
mod func_user_appointment;
mod func_provider_request;

use candid::{Principal, CandidType};
use std::collections::HashMap;
use std::cell::RefCell;
use serde::Serialize;

// struct_user 
type Users = HashMap<Principal, User>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct User {
    pub identity: String,
    pub appointments: Appointments,
    pub health_data: HealthData,
    pub personal_data: PersonalData,
    pub provider_requests: ProviderRequests,
    pub user_owner: String,
    pub user_owner_department: String,
    pub user_type: u8, // 0 normal 1 provider 2 doctor
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct HealthData {
    pub height: String,
    pub weight: String,
    pub blood_type: String,
    pub allergies: Vec<String>,
    pub diseases: Vec<String>,
    pub medications: Medications,
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct PersonalData {
    pub name: String,
    pub surname: String,
    pub birthday: String,
    pub country: String,
    pub city: String,
    pub province: String,
    pub mail: String,
    pub phone: String,
    pub picture: Vec<u8>,
}

type Medications = HashMap<String, Medication>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct Medication {
    pub prescription_date: String,
    pub barcode: String,
    pub prescription_number: String,
    pub medicine_name: String,
    pub dosage: String,
    pub period: String,
    pub usage_method: String,
    pub usage_count: String,
    pub box_count: String,
    pub provider_name: String,
    pub doctor_name: String,
    pub box_image: Vec<u8>,
    pub prospectus_pdf: Vec<u8>,
}

type ActiveSessions = Vec<Session>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct Session {
    pub user_id: Principal,
}

type Appointments = HashMap<Principal, Vec<AppointmentDetails>>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct AppointmentDetails {
    pub appointment_provider: String,
    pub appointment_department: String,
    pub appointment_doctor: String,
    pub appointment_date: String,
    pub appointment_time: String,
    pub appointment_status: u8 // 0: Pending, 1: Finished, 2: Cancelled
}

type Providers = HashMap<Principal, Provider>;
#[derive(Clone, Debug, Serialize, CandidType)]
struct Provider {
    pub provider_id: String,
    pub provider_name: String,
    pub provider_location: String,
    pub departments: Departments,
}

type Departments = HashMap<String, Department>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct Department {
    pub department_name: String,
    pub doctors: Doctors,
}

type Doctors = HashMap<String, Doctor>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct Doctor {
    pub doctor_provider: String,
    pub doctor_id: String,
    pub doctor_name: String,
    pub doctor_department: String,
    pub schedule:  Vec<DoctorAppointment>,
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct DoctorAppointment {
    pub patient_id: String,
    pub doctor_appointment_date: String,
    pub doctor_appointment_time: String,
    pub doctor_appointment_status: u8 // 0: Pending, 1: Scheduled, 2: Finished, 2: Cancelled
}

type ProviderRequests = HashMap<String, ProviderRequest>;
#[derive(Clone, Debug, CandidType, Serialize)]
struct ProviderRequest {
    pub provider_id: String,
    pub provider_name: String,
    pub request_status: u8,
}

thread_local! {
    pub static ACTIVE_SESSIONS: RefCell<ActiveSessions> = RefCell::default();
    pub static USERS: RefCell<Users> = RefCell::default();
    pub static PROVIDERS: RefCell<Providers> = RefCell::default();
}
