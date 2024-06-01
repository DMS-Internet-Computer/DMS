import React, { useEffect, useState } from 'react';
import { Col, Row, Card, Form, Select, Button, notification } from 'antd';
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react";

const { Option } = Select;

function Appointments() {
    const [providers, setProviders] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [doctorSchedule, setDoctorSchedule] = useState({});
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const { principal } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });

    useEffect(() => {
        listProviders();
    }, []);

    const listProviders = async () => {
        let mock_providers = await DMS_backend.list_providers();
        setProviders(mock_providers);
    };

    const listDepartments = async (providerId) => {
        let mock_departments = await DMS_backend.list_departments(providerId);
        setDepartments(mock_departments);
    }

    const listDoctors = async (providerId, departmentName) => {
        let mock_doctors = await DMS_backend.list_department_doctors(providerId, departmentName);
        setDoctors(mock_doctors);
    }

    const listDoctorsSchedule = async (providerId, departmentName, doctorId) => {
        let mock_doctor_schedule = await DMS_backend.list_appointments(providerId, departmentName, doctorId);
        const groupedSchedule = groupScheduleByDate(mock_doctor_schedule);
        setDoctorSchedule(groupedSchedule);
    }

    const groupScheduleByDate = (schedule) => {
        return schedule.reduce((acc, appointment) => {
            const { doctor_appointment_date, doctor_appointment_time } = appointment;
            if (!acc[doctor_appointment_date]) {
                acc[doctor_appointment_date] = [];
            }
            acc[doctor_appointment_date].push(doctor_appointment_time);
            return acc;
        }, {});
    }

    const handleProviderChange = async (value) => {
        setSelectedProvider(value);
        setSelectedDepartment(null);
        setSelectedDoctor(null);
        setDoctorSchedule({});
        setSelectedDate(null);
        setAvailableTimes([]);
        setSelectedSlot(null);
        await listDepartments(value);
    }

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
        setSelectedDoctor(null);
        setDoctorSchedule({});
        setSelectedDate(null);
        setAvailableTimes([]);
        setSelectedSlot(null);
        listDoctors(selectedProvider, value);
    }

    const handleDoctorChange = (value) => {
        setSelectedDoctor(value);
        const doctor = doctors.find(doc => doc.doctor_id === value);
        listDoctorsSchedule(selectedProvider, doctor.doctor_department, value);
    }

    const handleDateChange = (value) => {
        setSelectedDate(value);
        setAvailableTimes(doctorSchedule[value] || []);
        setSelectedSlot(null);
    }

    const handleTimeSlotChange = (value) => {
        setSelectedSlot(value);
    }

    const isTimeSlotAvailable = selectedDate && selectedDoctor;
    const scheduleAppointment = async () => {
    if (selectedProvider && selectedDepartment && selectedDoctor && selectedDate && selectedSlot) {
        try {
            await DMS_backend.schedule_appointment(selectedProvider, selectedDepartment, selectedDoctor, selectedDate, selectedSlot, principal);
            notification.success({ message: 'Appointment scheduled successfully!' });
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            notification.error({ message: 'Failed to schedule appointment.' });
        }
    } else {
        notification.warning({ message: 'Please fill all fields to schedule an appointment.' });
    }
};

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Card title={"Schedule Appointment"}>
                    <Form layout="vertical">
                        <Form.Item label="Select Provider">
                            <Select onChange={handleProviderChange}>
                                {providers.map(provider => (
                                    <Option key={provider.provider_id} value={provider.provider_id}>
                                        {provider.provider_name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {selectedProvider && (
                            <Form.Item label="Select Department">
                                <Select onChange={handleDepartmentChange}>
                                    {departments.map(department => (
                                        <Option key={department.department_name} value={department.department_name}>
                                            {department.department_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        {selectedDepartment && (
                            <Form.Item label="Select Doctor">
                                <Select onChange={handleDoctorChange}>
                                    {doctors.map(doctor => (
                                        <Option key={doctor.doctor_id} value={doctor.doctor_id}>
                                            {doctor.doctor_name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        {selectedDoctor && (
                            <Form.Item label="Select Date">
                                <Select onChange={handleDateChange}>
                                    {Object.keys(doctorSchedule).map((date, index) => (
                                        <Option key={index} value={date}>
                                            {date}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        {selectedDate && isTimeSlotAvailable && (
                            <Form.Item label="Select Available Time">
                                <Select onChange={handleTimeSlotChange}>
                                    {availableTimes.map((time, index) => (
                                        <Option key={index} value={time}>
                                            {time}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}

                        <Form.Item>
                            <Button type="primary" onClick={scheduleAppointment}>
                                Schedule Appointment
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col span={12}>
                <Card title={"Appointments"}>
                    {/* Displaying the doctor's schedule */}
                    <ul>
                        {Object.entries(doctorSchedule).map(([date, times], index) => (
                            <li key={index}>
                                {date}
                                <ul>
                                    {times.map((time, i) => (
                                        <li key={i}>{time}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </Card>
            </Col>
        </Row>
    );
}

export default Appointments;
