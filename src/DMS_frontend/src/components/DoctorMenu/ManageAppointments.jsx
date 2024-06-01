import React, { useEffect, useState } from 'react';
import { Card, Row, Col, DatePicker, TimePicker, Button, message, Table } from 'antd';
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react";
import moment from 'moment';

function ManageAppointments() {
    const [doc, setDoc] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState(null);
    const [appointments, setAppointments] = useState([]);

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
            let mock_user = await DMS_backend.get_current_user(principal);
            let user = JSON.parse(mock_user);
            let mock_doc = await DMS_backend.get_current_doctor(user.user_owner, user.user_owner_department, user.identity);
            setDoc(mock_doc[0]);
        } catch (error) {
            message.error('Failed to fetch doctor information');
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
            let mock_appointments = await DMS_backend.list_appointments(doc.doctor_provider, doc.doctor_department, principal);
            setAppointments(mock_appointments);
        } catch (error) {
            message.error('Failed to list appointments');
        }
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
        }
    ];

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Card title="Manage Appointments">
                    <DatePicker onChange={(date) => setAppointmentDate(date)} />
                    <TimePicker onChange={(time) => setAppointmentTime(time)} format="HH:mm" />
                    <Button type="primary" onClick={createAppointment} style={{ marginTop: '16px' }}>
                        Create Appointment
                    </Button>
                </Card>
            </Col>
            <Col span={12}>
                <Card title="Current Appointments">
                    <Table dataSource={appointments} columns={columns} rowKey={(record) => record.doctor_appointment_date + record.doctor_appointment_time} />
                </Card>
            </Col>
        </Row>
    );
}

export default ManageAppointments;
