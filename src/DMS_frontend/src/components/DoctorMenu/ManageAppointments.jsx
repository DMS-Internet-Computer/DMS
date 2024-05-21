import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, notification } from 'antd';
import { DMS_backend } from 'declarations/DMS_backend';
import { useConnect } from "@connect2ic/react"

const { Option } = Select;

function ManageAppointments() {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const { principal, isConnected } = useConnect({
        onConnect: () => { },
        onDisconnect: () => { }
    });
    
    useEffect(() => {
        get_user_data(principal);
    }, []);

    const get_user_data = async (identity) => {
        const userData = await DMS_backend.get_current_user(identity);
        console.log(identity);
        console.log("userData:", JSON.parse(userData)); // Log userData to check its value
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null; // Return null or handle the error in a different way
        }
    };

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
