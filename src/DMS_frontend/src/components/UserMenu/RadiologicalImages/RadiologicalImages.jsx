import { Table, Button, Image} from "antd";
import { useState } from "react";

function RadiologicalImages(){
  const [visible, setVisible] = useState(false);

  let scaleStep = 0.5;
  let prospectusUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  let boxImgUrl = 'https://st.depositphotos.com/51820676/60982/i/450/depositphotos_609828198-stock-photo-white-circle-pills-pack-two.jpg';


  const radiologicalImagesMockData = [
    {
      key: '1',
      date: '12.01.2024 15.00',
      providerName: "Hospital A",
      explanation: "Explanation Ex",
      doctorName: "Doctor A",
      boxImg: 'Box Image',
      prospectus: 'Prospectus',
    }
  ]

  const radiologicalImagesColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
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
        title: 'Explanation',
        dataIndex: 'explanation',
        key: 'explanation',
      },
      {
        title: 'Report',
        dataIndex: 'report',
        render: () => <Button type="primary" onClick={() => setVisible(true)}>
        Open
      </Button>
      },
      {
        title: 'Radiological Images',
        dataIndex: 'radiologicalImages',
        render: () => <Button type="primary" onClick={() => window.open(prospectusUrl)}>
        Open
      </Button>,
      },
      {
        title: 'Share',
        dataIndex: 'share',
        render: () => <Button type="primary" onClick={() => setVisible(true)}>
        Open
      </Button>
      }
  ]
  
  return(
      <>
        <Table size="small" dataSource={radiologicalImagesMockData} columns={radiologicalImagesColumns}/>
        <Image
        width={200}
        style={{
          display: 'none',
        }}
        src= {boxImgUrl}
        preview={{
          visible,
          scaleStep,
          src: boxImgUrl,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
      </>
    )
  }

  export default RadiologicalImages;