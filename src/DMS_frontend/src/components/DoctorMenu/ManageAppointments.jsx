import React, { useEffect, useState, Suspense } from 'react';
import { Card, Row, Col, DatePicker, TimePicker, Space, Button, message, Table, Tooltip, Modal, Spin } from 'antd'; // Import Spin
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react";
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import ThreeDModel from './ThreeDModel';
import PatientModal from './PatientModal';

function ManageAppointments() {
    const [doc, setDoc] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loadingAppointments, setLoadingAppointments] = useState(false); // State for loading appointments
    const [loadingDoctor, setLoadingDoctor] = useState(false); // State for loading doctor info

    const { principal, isConnected } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });

    useEffect(() => {
        if (isConnected) {
            getCurrentDoctor();
        }
    }, [isConnected]);

    useEffect(() => {
        if (doc) {
            listAppointments();
        }
    }, [doc]);

    const getCurrentDoctor = async () => {
        try {
            setLoadingDoctor(true); // Set loading to true while fetching doctor info
            let mock_user = await DMS_backend.get_current_user(principal);
            let user = JSON.parse(mock_user);
            let mock_doc = await DMS_backend.get_current_doctor(user.user_owner, user.user_owner_department, user.identity);
            setDoc(mock_doc[0]);
        } catch (error) {
            message.error('Failed to fetch doctor information');
        } finally {
            setLoadingDoctor(false); // Set loading to false after fetching doctor info
        }
    };

    const createAppointment = async () => {
        if (!appointmentDate || !appointmentTime) {
            message.warning('Please select both date and time');
            return;
        }

        const formattedDate = appointmentDate.format('YYYY-MM-DD');
        const formattedTime = appointmentTime.format('HH:mm');

        try {
            await DMS_backend.create_appointment(doc.doctor_provider, doc.doctor_department, principal, formattedDate, formattedTime);
            message.success('Appointment created successfully');
            listAppointments();
        } catch (error) {
            message.error('Failed to create appointment');
        }
    };

    const listAppointments = async () => {
        try {
            setLoadingAppointments(true); // Set loading to true while fetching appointments
            let mock_appointments = await DMS_backend.list_appointments(doc.doctor_provider, doc.doctor_department, principal);
            setAppointments(mock_appointments);
        } catch (error) {
            message.error('Failed to list appointments');
        } finally {
            setLoadingAppointments(false); // Set loading to false after fetching appointments
        }
    };

    const handlePatientClick = (patientId) => {
        setSelectedPatient(patientId);
    };

    const handleCloseModal = () => {
        setSelectedPatient(null);
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'doctor_appointment_date',
            key: 'doctor_appointment_date',
        },
        {
            title: 'Time',
            dataIndex: 'doctor_appointment_time',
            key: 'doctor_appointment_time',
        },
        {
            title: 'Status',
            dataIndex: 'doctor_appointment_status',
            key: 'doctor_appointment_status',
            render: status => (status === 0 ? 'Pending' : 'Confirmed')
        },
        {
            title: 'Patient ID',
            dataIndex: 'patient_id',
            key: 'patient_id',
            render: (patientId) => (
                <Tooltip title={patientId} placement="right">
                    <span onClick={() => handlePatientClick(patientId)}>
                        <UserOutlined style={{ marginRight: 4 }} />
                        {patientId.substring(0, 4)}
                    </span>
                </Tooltip>
            )
        }
    ];

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Card title="Manage Appointments">
                    <Space>
                        <DatePicker onChange={(date) => setAppointmentDate(date)} />
                        <TimePicker onChange={(time) => setAppointmentTime(time)} format="HH:mm" />
                        <Button type="primary" onClick={createAppointment}>
                            Create Appointment
                        </Button>
                    </Space>

                </Card>
            </Col>
            <Col span={12}>
                <Card title="Current Appointments">
                    <Spin spinning={loadingAppointments || loadingDoctor}> {/* Show Spin component while loading */}
                        <Table dataSource={appointments} columns={columns} rowKey={(record) => record.doctor_appointment_date + record.doctor_appointment_time} />
                    </Spin>
                </Card>
            </Col>
            <Modal
                title="Patient Details"
                visible={selectedPatient !== null}
                onCancel={handleCloseModal}
                footer={null}
                centered
                width={1600}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Card>
                            <Canvas style={{ width: '100%', height: '570px', marginTop: '20px' }}>
                                <Suspense fallback={null}>
                                    <Stage>
                                        <ThreeDModel />
                                    </Stage>
                                </Suspense>
                                <OrbitControls />
                            </Canvas>
                        </Card>
                    </Col>
                    <Col span={16}>
                        <PatientModal patientId={selectedPatient} />
                    </Col>
                </Row>
            </Modal>
        </Row>
    );
}

export default ManageAppointments;
