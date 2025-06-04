import React, { useState } from 'react';
import { history } from 'umi';
import { Button, Form, InputNumber, Card, Row, Col, message } from 'antd';
import { calculateRecuperator } from '@/services/api';
import { NeedlRecuperatorInputModel, defaultInputValues } from '@/models/inputModel';
import { NeedlRecuperatorResultModel } from '@/models/resultModel';

const InputPage: React.FC = () => {
  const [form] = Form.useForm<NeedlRecuperatorInputModel>();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: NeedlRecuperatorInputModel) => {
    setLoading(true);
    try {
      const result = await calculateRecuperator(values);
      
      history.push('/result', {
        inputData: values,
        resultData: result
      });

    } catch (error) {
      message.error('Ошибка расчета');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Параметры рекуператора" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultInputValues}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Объем нагреваемого воздуха (м3/ч)"
                name="rashod_vozduh"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={100} max={3000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Объем дымовых газов (м3/ч)"
                name="rashod_dgas"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={100} max={3000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Температура подогрева воздуха у печи (°С)"
                name="temperatura_vozd_nagrev"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={20} max={800} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Начальная температура воздуха (°С)"
                name="temperatura_vozd_start"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={-20} max={250} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Температура дымовых газов (°С)"
                name="temperatura_dgas"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={350} max={900} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Падение температуры в воздухопроводе от рекуператора до печи (°С)"
                name="ohlazhdenie_vozd"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={0} max={200} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Потери тепла рекуператора в окружающее пространство, %"
                name="ohlazhdenie_rekuper"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={0} max={99} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Теплоемкость дымовых газов, кДж/(м3*°С)"
                name="temploemkost_dgas"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={1.42} max={1.59} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Длина труб, мм"
                name="pipe_length"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={880} max={1640} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Сечение для прохода воздуха, м2"
                name="sechenie_vozd_pipe"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber value={0.008} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Сечение для прохода дымовых газов, м2"
                name="sechenie_dgas_pipe"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={0.042} max={0.12} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Условная поверхность нагрева, м2"
                name="poverhnost_nagreva"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={0.25} max={0.5} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Количество труб по пути воздуха, шт."
                name="num_pipe_vozd"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={4} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Количество труб по пути дымовых газов, шт."
                name="num_pipe_dgas"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={3} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Количество ходов"
                name="num_moves"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Эмпирический коэффициент для расчета теплоотдачи, B"
                name="b"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={17} max={41.2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Эмпирический коэффициент для расчета теплоотдачи, n"
                name="n"
                rules={[{ required: true, message: 'Введите значение' }]}
              >
                <InputNumber min={0.72} max={1.03} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>


          <Row gutter={16}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={resetForm}>
                Сбросить
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Рассчитать
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default InputPage;