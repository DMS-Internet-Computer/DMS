import React, { useEffect, useState } from 'react';
import { Card, Tabs, Rate, Descriptions, Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import DoctorRadiologicalImages from './PatientManagement/DoctorRadiologicalImages';
import DoctorPrescriptions from './PatientManagement/DoctorPrescriptions';
import DoctorDiseases from './PatientManagement/DoctorDiseases';
import DoctorMedications from './PatientManagement/DoctorMedications';
import DoctorTests from './PatientManagement/DoctorTests';
import { DMS_backend } from 'declarations/DMS_backend';

function PatientModal({ patientId }) {
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        getPatientInfo();
    }, [patientId]);

    const getPatientInfo = async () => {
        try {
            let mock_patient = await DMS_backend.get_current_user(patientId);
            console.log("Patient raw", mock_patient);
            let patient = JSON.parse(mock_patient);
            console.log("Patient parsed", patient);
            setPatient(patient);
        }
        catch (e) {
            console.log("Error getting patient info: ", e);
        }
    }

    return (
        <>
            <Card>
                <Card title="Patient Information">
                    <Row gutter={[16, 16]}>
                        <Col span={18}>
                            {patient && (
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="Name">{patient.personal_data.name == "" ? "N/A" : patient.personal_data.name}</Descriptions.Item>
                                    <Descriptions.Item label="Surname">{patient.personal_data.surname == "" ? "N/A" : patient.personal_data.surname}</Descriptions.Item>
                                    <Descriptions.Item label="Birthday">{patient.personal_data.birthday == "" ? "N/A" : patient.personal_data.birthday}</Descriptions.Item>
                                    <Descriptions.Item label="Blood Type">{patient.health_data.blood_type == "" ? "N/A" : patient.health_data.blood_type}</Descriptions.Item>
                                    <Descriptions.Item label="Height">{patient.health_data.height == "" ? "N/A" : patient.health_data.height}</Descriptions.Item>
                                    <Descriptions.Item label="Weight">{patient.health_data.weight == "" ? "N/A" : patient.health_data.weight}</Descriptions.Item>
                                </Descriptions>
                            )}
                        </Col>
                        <Col span={6}>
                            <Avatar
                                style={{ marginTop: '21px', marginLeft: '44px' }}
                                size={128}
                                icon={<UserOutlined />}
                            />
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Tabs
                        type="card"
                        items={[
                            { label: "Tests", key: 1, children: <DoctorTests patientId={patientId} /> },
                            { label: "Medications", key: 2, children: <DoctorMedications patientId={patientId} /> },
                            { label: "Prescriptions", key: 3, children: <DoctorPrescriptions patientId={patientId} /> },
                            { label: "Radiological Images", key: 4, children: <DoctorRadiologicalImages patientId={patientId} /> },
                            { label: "Diagnoses", key: 5, children: <DoctorDiseases patientId={patientId} /> },
                        ]}
                    />
                </Card>
            </Card>
        </>
    );
}

export default PatientModal;
