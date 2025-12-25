import { Layout, Modal, Form, InputNumber, Button, message } from 'antd'
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
import { useState, useEffect } from 'react'
import { XHYSvg } from '@/utils/icon/svg'
import { useSearchParams } from 'react-router-dom'

type FieldType = {
  width: number
  height: number
}
type CustomIconComponentProps = GetProps<typeof Icon>;

function App () {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [searchParams] = useSearchParams();

  const XHYIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={XHYSvg} {...props} />
  );
  const {canvas, undoRedoManager} = useFabricCanvas('canvas', {
    width,
    height,
    backgroundColor: '#ffffff'
  })

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    const { width, height } = values
    if (width <= 0 || height <= 0) {
      console.log(width, height)
      message.error('宽度和高度必须大于0');
      return
    }
    setWidth(width as number)
    setHeight(height as number)
    setIsModalOpen(false)
  }

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = errorInfo => {
    console.log('Failed:', errorInfo)
  }
  /*
    优化： 根据URL参数可以快捷设置画布大小
  */
  useEffect(() => {
    const width = Number(searchParams.get('width'))
    const height = Number(searchParams.get('height'))
    const isValidWidth = Number.isInteger(width) && width > 0;
    const isValidHeight = Number.isInteger(height) && height > 0;
    if (isValidWidth && isValidHeight) {
      setWidth(width)
      setHeight(height)
    } else {
      setIsModalOpen(true);
      if (isValidWidth) {
        setWidth(width);
      }
      if (isValidHeight) {
        setHeight(height);
      }
    }
  }, [])
  return (
    <>
      <CanvasContext.Provider
        value={{
          canvas,
          width,
          height,
          undoRedoManager,
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
          initialValues={{ width, height }}
        >
          <Form.Item<FieldType>
            label='宽度'
            name='width'
            rules={[{ required: true, message: '请输入宽度!' }]}
          >
            <InputNumber min={0} max={9999}  />
          </Form.Item>

          <Form.Item<FieldType>
            label='高度'
            name='height'
            rules={[{ required: true, message: '请输入高度!' }]}
          >
            <InputNumber min={0} max={9999}  />
          </Form.Item>

          <div className='set-canvas-size-button'>
            <Button onClick={()=>{
              form.submit()
            }} icon={<XHYIcon style={{ fontSize: 24 }} />} iconPosition={'end'}>
              开始绘画
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default App
