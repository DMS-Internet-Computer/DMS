mod auth;
mod administration;
mod provider_utils;
mod user_utils;

use candid::{Principal, CandidType};
use std::collections::HashMap;
use std::cell::RefCell;

use serde::Serialize;

// Active Sessions contains logged in principal ids.
type ActiveSessions = Vec<Session>;
// User Types
type Users = HashMap<Principal, User>;
type Appointments = HashMap<Principal, Vec<AppointmentDetails>>; // This principal stands for providers principal ID
// Admins ??
type Providers = HashMap<Principal, Provider>;

// Provider Subsections
type Departments = HashMap<String, Doctors>;
type Doctors = HashMap<String, Dates>;
type Dates = HashMap<String, Vec<String>>;
type Medications = HashMap<String, Medication>;
type ProviderRequests = HashMap<String, ProviderRequest>;

#[derive(Clone, Debug, CandidType, Serialize)]
struct ProviderRequest {
    pub provider_id: String,
    pub provider_name: String,
    pub request_status: u8,
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

thread_local! {
    pub static ACTIVE_SESSIONS: RefCell<ActiveSessions> = RefCell::default();
    pub static USERS: RefCell<Users> = RefCell::default();
    pub static PROVIDERS: RefCell<Providers> = RefCell::default();
}

// Session Struct
#[derive(Clone, Debug, CandidType, Serialize)]
struct Session {
    pub user_id: Principal, // Check here
}



// User Struct
#[derive(Clone, Debug, CandidType, Serialize)]
struct User {
    pub identity: String,
    pub appointments: Appointments,
    pub health_data: HealthData,
    pub personal_data: PersonalData,
    pub provider_requests: ProviderRequests,
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
}

#[derive(Clone, Debug, CandidType, Serialize)]
struct AppointmentDetails {
    pub department: String,
    pub doctor: String,
    pub date: String,
    pub time: String,
}

#[derive(Clone, Debug, Serialize, CandidType)]
struct Provider { // a.k.a. Hospitals - Medical Service PROVIDERS
    pub provider_name: String,
    pub provider_location: String, // <--< This can be removed 
    pub departments: Departments, // Department's Name, Department's Doctors
}

