import { Table, Button, Image, Form, Input, Upload } from "antd";
import { useState, useEffect } from "react";
import { DMS_backend } from 'declarations/DMS_backend';
import { PlusOutlined } from '@ant-design/icons';

function Medications() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState()
  const [medications, setMedications] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetchMedications();
    console.log(medications);
  }, []);

  let scaleStep = 0.5;
  //let dummyProspectusUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  //let dummyBoxImgUrl = 'https://st.depositphotos.com/51820676/60982/i/450/depositphotos_609828198-stock-photo-white-circle-pills-pack-two.jpg';

  function displayImageFromBase64(base64ImageData) {
    return `data:image/png;base64,${base64ImageData}`;
  }
  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  // const base64ImageData = (medications.Ok != []) ? arrayBufferToBase64(medications.Ok[0].box_image) : '';
  // const imageUrl = displayImageFromBase64(base64ImageData);


  const medicationsMockData = [];

  let base64ImageData = '';
  let imageUrl = '';
  let pdfUrl = '';
  if (medications && medications.Ok) {
    for (let i = 0; i < medications.Ok.length; i++) {
      base64ImageData = arrayBufferToBase64(medications.Ok[i].box_image);
      imageUrl = displayImageFromBase64(base64ImageData);
      const blob = new Blob([medications.Ok[i].prospectus_pdf], { type: 'application/pdf' });
      pdfUrl = URL.createObjectURL(blob);
   
      medicationsMockData.push({
        key: i,
        date: medications.Ok[i].prescription_date,
        barcode: medications.Ok[i].barcode,
        number: medications.Ok[i].prescription_number,
        medicineName: medications.Ok[i].medicine_name,
        dosage: medications.Ok[i].dosage,
        period: medications.Ok[i].period,
        usageMethod: medications.Ok[i].usage_method,
        usageNumber: medications.Ok[i].usage_count,
        boxCount: medications.Ok[i].box_count,
        providerName: medications.Ok[i].provider_name,
        doctorName: medications.Ok[i].doctor_name,
        boxImg: imageUrl,
        prospectus: pdfUrl,
      });
    }
  }


  const medicationsColumns = [
    {
      title: 'Prescription Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: 'Prescription Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Medicine Name',
      dataIndex: 'medicineName',
      key: 'medicineName',
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      key: 'dosage',
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Usage Method',
      dataIndex: 'usageMethod',
      key: 'usageMethod',
    },
    {
      title: 'Usage Count',
      dataIndex: 'usageNumber',
      key: 'usageNumber',
    },
    {
      title: 'Box Count',
      dataIndex: 'boxCount',
      key: 'boxCount',
    },
    {
      title: 'Provider Name',
      dataIndex: 'providerName',
      key: 'providerName',
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Box Image',
      dataIndex: 'boxImg',
      render: () => <Button type="primary" onClick={() => setVisible(true)}>
        Open
      </Button>
    },
    {
      title: 'Prospectus',
      dataIndex: 'prospectus',
      render: () => <Button type="primary" onClick={() => window.open(pdfUrl)}>
        Open
      </Button>,
    }
  ]

  const convertToUint8Array = async (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('File is empty'));
      }
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const fetchMedications = async () => {
    try {
      const user_id = "2vxsx-fae"; // Replace with actual user ID
      const medications = await DMS_backend.list_medications(user_id);
      setMedications(medications);
      console.log(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  };


  const handleAddMedication = async (values) => {
    try {
      const imageData = await convertToUint8Array(image);
      const pdfData = await convertToUint8Array(pdfFile);


      values.box_image = imageData;
      values.prospectus_pdf = pdfData;
      //#DEBUG
      console.log(values);
      await DMS_backend.add_medication(
        values.user_id,
        values.prescription_date,
        values.barcode,
        values.prescription_number,
        values.medicine_name,
        values.dosage,
        values.period,
        values.usage_method,
        values.usage_count,
        values.box_count,
        values.provider_name,
        values.doctor_name,
        values.box_image,
        values.prospectus_pdf,
      );
      console.log('Medication added successfully');
    } catch (error) {
      console.error("Error adding medication:", error);
      console.log('Failed to add medication');
    }
  };
  const changeFile = async (file) => {
    if (file != null) {
      setImage(file);
    }
  };

  return (
    <>
      <Table size="small" dataSource={medicationsMockData} columns={medicationsColumns} />
      <Image
        width={200}
        style={{
          display: 'none',
        }}
        src={imageUrl}
        preview={{
          visible,
          scaleStep,
          src: imageUrl,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
      <h2>Add medication</h2>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        onFinish={handleAddMedication}

      >
        <Form.Item
          label="Patients Identity"
          name="user_id"
          rules={[
            {
              required: true,
              message: 'Please enter Patients Identity',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Prescription Date"
          name="prescription_date"
          rules={[
            {
              required: true,
              message: 'Please enter Prescription Date',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Barcode"
          name="barcode"
          rules={[
            {
              required: true,
              message: 'Please enter Barcode',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Prescription Number"
          name="prescription_number"
          rules={[
            {
              required: true,
              message: 'Please enter Prescription Number',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Medicine Name"
          name="medicine_name"
          rules={[
            {
              required: true,
              message: 'Please enter Medicine Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Dosage"
          name="dosage"
          rules={[
            {
              required: true,
              message: 'Please enter Dosage',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Period"
          name="period"
          rules={[
            {
              required: true,
              message: 'Please enter Period',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Usage Method"
          name="usage_method"
          rules={[
            {
              required: true,
              message: 'Please enter Usage Method',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Usage Count"
          name="usage_count"
          rules={[
            {
              required: true,
              message: 'Please enter Usage Count',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Box Count"
          name="box_count"
          rules={[
            {
              required: true,
              message: 'Please enter Box Count',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Provider Name"
          name="provider_name"
          rules={[
            {
              required: true,
              message: 'Please enter Provider Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Doctor Name"
          name="doctor_name"
          rules={[
            {
              required: true,
              message: 'Please enter Doctor Name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Upload Image"
          name="box_image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                changeFile(file);
              }
            }}
          >
            {image ? (
              <Image src={URL.createObjectURL(image)} alt="Uploaded Box Image" style={{ width: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>
            <Form.Item
          label="Upload PDF"
          name="pdf_file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.fileList.length > 0) {
                const file = info.fileList[0].originFileObj;
                setPdfFile(file);
              }
            }}
          >
            <Button icon={<PlusOutlined />}>Select PDF File</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit">Add Medication</Button>

      </Form>
    </>
  )
}

export default Medications;