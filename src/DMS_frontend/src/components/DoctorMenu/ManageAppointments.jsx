import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, notification } from 'antd';
import { DMS_backend } from 'declarations/DMS_backend';

const { Option } = Select;

function ManageAppointments() {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        listProviders();
    }, []);

    const listProviders = async () => {
        try {
            const providers = await DMS_backend.list_providers();
            console.log(providers);
            setProviders(providers);
        } catch (error) {
            console.error('Error listing providers:', error);
            notification.error({
                message: 'Hata',
                description: 'Sağlayıcıları listelerken bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };

    const onSelectProvider = async (providerId) => {
        setSelectedProvider(providerId);
        try {
            const departments = await DMS_backend.list_departments(providerId);
            console.log(departments);
            setDepartments(departments);
        } catch (error) {
            console.error('Error listing departments:', error);
            notification.error({
                message: 'Hata',
                description: 'Departmanları listelerken bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };

    const onSelectDepartment = async (departmentName) => {
        setSelectedDepartment(departmentName);
        try {
            const doctors = await DMS_backend.list_doctors(selectedProvider, departmentName);
            console.log(doctors);
            setDoctors(doctors);
        } catch (error) {
            console.error('Error listing doctors:', error);
            notification.error({
                message: 'Hata',
                description: 'Doktorları listelerken bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    };

    const onFinish = async (values) => {
        try {
            setSubmitting(true);
            await DMS_backend.create_appointment(
                selectedProvider,
                selectedDepartment,
                values.doctor,
                values.appointmentDate.format('YYYY-MM-DD'),
                values.appointmentTime
            );
            notification.success({
                message: 'Randevu Başarılı',
                description: 'Randevunuz başarıyla oluşturuldu.',
            });
            form.resetFields();
        } catch (error) {
            console.error('Error creating appointment:', error);
            notification.error({
                message: 'Hata',
                description: 'Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Randevu Al</h1>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    name="provider"
                    label="Sağlayıcı"
                    rules={[{ required: true, message: 'Lütfen sağlayıcıyı seçin.' }]}
                >
                    <Select
                        placeholder="Lütfen Sağlayıcı Seçin"
                        onChange={onSelectProvider}
                    >
                        {providers.map(provider => (
                            <Option key={provider.provider_id} value={provider.provider_id}>
                                {provider.provider_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="department"
                    label="Departman"
                    rules={[{ required: true, message: 'Lütfen departmanı seçin.' }]}
                >
                    <Select
                        placeholder="Lütfen Departman Seçin"
                        onChange={onSelectDepartment}
                        disabled={!selectedProvider}
                    >
                        {departments.map(department => (
                            <Option key={department.department_name} value={department.department_name}>
                                {department.department_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="doctor"
                    label="Doktor"
                    rules={[{ required: true, message: 'Lütfen doktoru seçin.' }]}
                >
                    <Select
                        placeholder="Lütfen Doktor Seçin"
                        disabled={!selectedProvider || !selectedDepartment}
                    >
                        {doctors.map(doctor => (
                            <Option key={doctor.doctor_id} value={doctor.doctor_id}>
                                {doctor.doctor_name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="appointmentDate"
                    label="Randevu Tarihi"
                    rules={[{ required: true, message: 'Lütfen randevu tarihini seçin.' }]}
                >
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item
                    name="appointmentTime"
                    label="Randevu Saati"
                    rules={[{ required: true, message: 'Lütfen randevu saati seçin.' }]}
                >
                    <Select placeholder="Randevu Saati Seçin">
                        {['09:00', '10:00', '11:00', '14:00', '15:00'].map(time => (
                            <Option key={time} value={time}>
                                {time}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={submitting}>
                        Randevu Al
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default ManageAppointments;
