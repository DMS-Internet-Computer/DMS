
mod func_user;
mod func_provider;

mod func_medications;
mod func_departments;
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
    pub user_type: u8,
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
}

// Active Sessions contains logged in principal ids.
type ActiveSessions = Vec<Session>;
// User Types

type Appointments = HashMap<Principal, Vec<AppointmentDetails>>; // This principal stands for providers principal ID
// Admins ??

type Providers = HashMap<Principal, Provider>;
// Provider Subsections
type Departments = HashMap<String, Department>;
type Doctors = HashMap<String, Doctor>;
type Dates = HashMap<String, Vec<String>>;
type Medications = HashMap<String, Medication>;
type ProviderRequests = HashMap<String, ProviderRequest>;

thread_local! {
    pub static ACTIVE_SESSIONS: RefCell<ActiveSessions> = RefCell::default();
    pub static USERS: RefCell<Users> = RefCell::default();
    pub static PROVIDERS: RefCell<Providers> = RefCell::default();
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct Department {
    pub department_name: String,
    pub doctors: Doctors,
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct Doctor {
    pub doctor_name: String,
    pub doctor_department: String,
    pub dates: Dates,
}

// Session Struct
#[derive(Clone, Debug, CandidType, Serialize)]
struct Session {
    pub user_id: Principal, // Check here
}

// User Struct




#[derive(Clone, Debug, CandidType, Serialize)]
struct AppointmentDetails {
    pub department: String,
    pub doctor: String,
    pub date: String,
    pub time: String,
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct ProviderRequest {
    pub provider_id: String,
    pub provider_name: String,
    pub request_status: u8,
}

#[derive(Clone, Debug, Serialize, CandidType)]
struct Provider { 
    pub provider_name: String,
    pub provider_location: String,
    pub departments: Departments, // Department's Name, Department's Doctors
}

