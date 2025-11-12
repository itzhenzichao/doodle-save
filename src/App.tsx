import { Layout, Modal, Form, InputNumber, Button } from 'antd'
import Icon from '@ant-design/icons';
import type { FormProps, GetProps } from 'antd'
const { Header, Sider, Content } = Layout
import { layoutStyle } from './Layout.style'
import './App.scss'
import Toolbar from '@/components/toolbar'
import DoodleHeader from '@/components/header'
import DoodleContent from '@/components/content'
import useFabricCanvas from '@/utils/hooks/initCanvas'
import { CanvasContext } from '@/utils/contexts'
import { useState } from 'react'
import { XHYSvg } from '@/utils/icon/svg'
type FieldType = {
  width?: number
  height?: number
}
type CustomIconComponentProps = GetProps<typeof Icon>;

function App () {
  const [form] = Form.useForm();
  const { canvas } = useFabricCanvas('canvas', {
    width: 300,
    height: 300,
    backgroundColor: '#ffffff'
  })
const [isModalOpen, setIsModalOpen] = useState(true)

const XHYIcon = (props: Partial<CustomIconComponentProps>) => (
  <Icon component={XHYSvg} {...props} />
);

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    console.log('Success:', values)
    setIsModalOpen(false)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  return (
    <>
      <CanvasContext.Provider
        value={{
          canvas,
          width: 300,
          height: 300
        }}
      >
        <Layout style={layoutStyle}>
          <Header className='header-content'>
            <DoodleHeader></DoodleHeader>
          </Header>
          <Layout className='site-layout'>
            <Sider className='sider-content' width='71px'>
              <Toolbar />
            </Sider>
            <Content className='doodle-content'>
              <DoodleContent></DoodleContent>
            </Content>
          </Layout>
        </Layout>
      </CanvasContext.Provider>
      <Modal
        title='设置画布大小'
        className="set-canvas-size"
        centered={true}
        closable={false}
        open={isModalOpen}
        footer={null}
        maskClosable={false}
        keyboard={false}
        width={220}
      >
        <Form
          form={form}
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
          initialValues={{ width: 300, height: 300 }}
        >
          <Form.Item<FieldType>
            label='宽度'
            name='width'
            rules={[{ required: true, message: '请输入宽度!' }]}
          >
            <InputNumber min={1} max={9999}  />
          </Form.Item>

          <Form.Item<FieldType>
            label='高度'
            name='height'
            rules={[{ required: true, message: '请输入高度!' }]}
          >
            <InputNumber min={1} max={9999}  />
          </Form.Item>

          <div className='set-canvas-size-button'>
            <Button onClick={()=>{
              form.submit()
            }} icon={<XHYIcon style={{ fontSize: 24 }} />} iconPosition={'end'}>
              Search
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default App
