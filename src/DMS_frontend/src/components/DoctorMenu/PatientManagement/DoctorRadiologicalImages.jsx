import { useState, useEffect } from "react";
import { DMS_backend } from 'declarations/DMS_backend';
import { Button, Modal, Form, Input, Upload, Image, Table } from "antd";
import { PlusOutlined } from '@ant-design/icons';

function DoctorRadiologicalImages({ patientId }) {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState();
  const [images, setImages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const scaleStep = 0.5;

  useEffect(() => {
    fetchImages();
    console.log(images);
  }, [patientId]);

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

  const imagesMockData = [];

  let base64ImageData = '';
  let imageUrl = '';
  let pdfUrl = '';

  if (images && images.Ok) {
    for (let i = 0; i < images.Ok.length; i++) {
      base64ImageData = arrayBufferToBase64(images.Ok[i].image);
      imageUrl = displayImageFromBase64(base64ImageData);
      const blob = new Blob([images.Ok[i].report], { type: 'application/pdf' });
      pdfUrl = URL.createObjectURL(blob);
      console.log("Image Url", imageUrl);
      console.log("Pdf Url", pdfUrl);
      imagesMockData.push({
        key: i,
        date: images.Ok[i].date,
        provider_name: images.Ok[i].provider_name,
        doctor_name: images.Ok[i].doctor_name,
        explanation: images.Ok[i].explanation,
        report: pdfUrl,
        image: imageUrl,
      });
    }
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Provider Name',
      dataIndex: 'provider_name',
      key: 'provider_name',
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctor_name',
      key: 'doctor_name',
    },
    {
      title: 'Explanation',
      dataIndex: 'explanation',
      key: 'explanation',
    },
    {
      title: 'Report',
      dataIndex: 'report',
      render: (text, record) => <Button type="primary" onClick={() => window.open(record.report)}>Open</Button>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (text, record) => <Button type="primary" onClick={() => setVisible(true)}>Open</Button>
    },
  ];

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

  const fetchImages = async () => {
    try {
      const images = await DMS_backend.list_radiological_images(patientId);
      setImages(images);
      console.log(images);
    } catch (error) {
      console.error("Error fetching radiological images:", error);
    }
  };

  const handleAddImage = async (values) => {
    try {
      const imageData = await convertToUint8Array(image);
      const pdfData = await convertToUint8Array(pdfFile);

      await DMS_backend.add_radiological_image(
        patientId,
        values.date,
        values.provider_name,
        values.doctor_name,
        values.explanation,
        pdfData,
        imageData
      );
      console.log('Radiological image added successfully');
      setModalVisible(false);
      fetchImages();
    } catch (error) {
      console.error("Error adding radiological image:", error);
      console.log('Failed to add radiological image');
    }
  };

  const changeFile = async (file) => {
    if (file != null) {
      setImage(file);
    }
  };

  return (
    <>
      <Table dataSource={imagesMockData} columns={columns} />
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
      <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginLeft: '850px', marginTop: '20px' }}>Add</Button>
      <Modal
        title="Add Radiological Image"
        centered
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          onFinish={handleAddImage}
        >
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please enter Date' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Provider Name"
            name="provider_name"
            rules={[{ required: true, message: 'Please enter Provider Name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Doctor Name"
            name="doctor_name"
            rules={[{ required: true, message: 'Please enter Doctor Name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Explanation"
            name="explanation"
            rules={[{ required: true, message: 'Please enter Explanation' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Upload Image"
            name="image"
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
                <Image src={URL.createObjectURL(image)} alt="Uploaded Image" style={{ width: '100%' }} />
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
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">Add Radiological Image</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default DoctorRadiologicalImages;
