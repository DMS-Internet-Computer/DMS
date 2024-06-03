import { Table, Button, Image, Form, Input, Upload } from "antd";
import { useState, useEffect } from "react";
import { DMS_backend } from 'declarations/DMS_backend';
import { PlusOutlined } from '@ant-design/icons';
import { useConnect } from "@connect2ic/react"

function Medications() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState()
  const [medications, setMedications] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const { principal, isConnected } = useConnect({
    onConnect: () => { },
    onDisconnect: () => { }
});

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



  const fetchMedications = async () => {
    try {
      const medications = await DMS_backend.list_medications(principal);
      setMedications(medications);
      console.log(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
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
    </>
  )
}

export default Medications;