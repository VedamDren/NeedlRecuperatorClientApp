import { NeedlRecuperatorInputModel } from '@/models/inputModel';
import { NeedlRecuperatorResultModel } from '@/models/resultModel';
import { request, useModel } from '@umijs/max';
import { Button, Form, Input, message, Modal, Popconfirm, Space, Table, TableProps, Card } from 'antd';
import { CalculatorOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { history } from 'umi';

interface VariantFilter {
  name?: string;
}

export default function VariantsPage() {
  const { initialState } = useModel('@@initialState');

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Название',
      dataIndex: 'name',
    },
    {
      title: 'Действие',
      key: 'action',
      render: (value, record, index) => (
        <Space>
          <Button 
            type="primary" 
            icon={<CalculatorOutlined />}
            size="small"
            onClick={() => onCalculation(record.id)}
          >
            Рассчитать
          </Button>
          <Popconfirm
            title="Удаляем вариант?"
            okText="Да"
            cancelText="Нет"
            onConfirm={() => onRemove(record.id)}
          >
            <Button 
              type="default" 
              danger 
              icon={<DeleteOutlined />}
              size="small"
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCalculateOpen, setIsModalCalculateOpen] = useState(false);
  const [formCalculate] = Form.useForm();
  const [searchForm] = Form.useForm();

  useEffect(() => {
    updateData({});
  }, []);

  const updateData = (filter: VariantFilter) => {
    if (!initialState?.login) {
      message.error('Необходимо войти в систему');
      return;
    }

    console.log('Поиск вариантов...', filter);

    request('/api/Variant/GetAllVariantsPost', { 
      data: filter, 
      method: 'POST'
    }).then((result: any[]) => {
      setDataSource(result);
    }).catch(error => {
      console.error('Ошибка при загрузке вариантов:', error);
      message.error('Ошибка при загрузке вариантов');
    });
  };

  const onRemove = (id: number) => {
    if (!initialState?.login) {
      message.error('Необходимо войти в систему');
      return;
    }

    console.log('Удаляем вариант id = ' + id);
    
    request(`/api/Variant/DeleteVariant/variants/${id}`, { 
      method: 'DELETE' 
    }).then(() => {
      const newDataSource = dataSource.filter(item => item.id !== id);
      setDataSource(newDataSource);
      message.success('Вариант удален');
    }).catch(error => {
      console.error('Ошибка при удалении:', error);
      message.error('Ошибка при удалении варианта');
    });
  };

  // Расчет варианта
  const onCalculation = (id: number) => {
    if (!initialState?.login) {
      message.error('Необходимо войти в систему');
      return;
    }

    setIsModalCalculateOpen(true);
    
    request(`/api/Variant/GetVariant/variants/${id}`, { 
      method: 'GET' 
    }).then((result: any) => {
      formCalculate.setFieldsValue(result);
    }).catch(error => {
      console.error('Ошибка при загрузке варианта:', error);
      message.error('Ошибка при загрузке варианта');
    });
  };

  const onVariantCalculation = async (data: NeedlRecuperatorInputModel) => {
    try {
      if (!initialState?.login) {
        message.error('Необходимо войти в систему');
        return;
      }

      const result = await request<NeedlRecuperatorResultModel>(
        '/api/Recuperator/Calculate/calculate', 
        {
          method: 'POST',
          data,
        }
      );

      history.push('/result', {
        inputData: data,
        resultData: result
      });
      
      setIsModalCalculateOpen(false);
    } catch (error) {
      console.error('Ошибка расчета:', error);
      message.error('Ошибка расчета');
    }
  };

  // Сохранение нового варианта
  const onVariantAdd = (data: any) => {
    if (!initialState?.login) {
      message.error('Необходимо войти в систему');
      return;
    }

    console.log('Сохранение варианта:', data);
    
    request('/api/Variant/SaveVariant', { 
      data, 
      method: 'PUT' 
    }).then((result: any) => {
      setIsModalOpen(false);
      
      const newVariants = [result, ...dataSource];
      setDataSource(newVariants);
      message.success('Новый вариант добавлен');
    }).catch((error: any) => {
      console.error('Ошибка при сохранении:', error);
      message.error(error.message || 'Ошибка при сохранении варианта');
    });
  };

  // Обработчик поиска
  const handleSearch = (values: VariantFilter) => {
    updateData(values);
  };

  // Сброс поиска
  const handleResetSearch = () => {
    searchForm.resetFields();
    updateData({});
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Заголовок и кнопка назад */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/')}
          style={{ marginRight: '16px' }}
        >
          На главную
        </Button>
        <h1 style={{ margin: 0, flex: 1 }}>Мои варианты расчетов</h1>
      </div>

      {/* Блок информации о пользователе */}
      <Card style={{ marginBottom: '20px', background: '#f0f8ff' }}>
        {initialState?.login 
          ? `Вы вошли как: ${initialState.login}` 
          : 'Необходимо войти в систему для работы с вариантами'
        }
      </Card>

      {/* Форма поиска */}
      <Card style={{ marginBottom: '20px' }}>
        <Form
          form={searchForm}
          layout='inline'
          onFinish={handleSearch}
        >
          <Form.Item name="name" label="Название">
            <Input 
              placeholder="Введите название варианта" 
              style={{ width: '200px' }}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!initialState?.login}>
              Найти
            </Button>
            <Button 
              style={{ marginLeft: '8px' }} 
              onClick={handleResetSearch}
              disabled={!initialState?.login}
            >
              Сбросить
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Кнопка добавления */}
      <Button 
        type="primary" 
        onClick={() => setIsModalOpen(true)}
        disabled={!initialState?.login}
        style={{ marginBottom: '20px' }}
      >
        Новый вариант
      </Button>

      {/* Модальное окно добавления варианта */}
      <Modal 
        title="Добавление нового варианта" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        footer={null}
        width={800}
      >
        <Form
          layout="vertical"
          onFinish={onVariantAdd}
          style={{ maxWidth: '100%' }}
        >
          <Form.Item 
            name="name" 
            label="Название" 
            rules={[{ required: true, message: 'Введите название варианта' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item name="rashod_vozduh" label="Объем нагреваемого воздуха при входе в рекуператор">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="rashod_dgas" label="Объем дымовых газов при входе в рекуператор">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temperatura_vozd_nagrev" label="Температура подогрева воздуха у печи">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temperatura_vozd_start" label="Начальная температура воздуха">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temperatura_dgas" label="Температура дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="ohlazhdenie_vozd" label="Падение температуры в воздухопроводе от рекуператора до печи">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="ohlazhdenie_rekuper" label="Потери тепла рекуператора в окружающее пространство">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temploemkost_dgas" label="Теплоемкость дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="pipe_length" label="Длина труб">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="sechenie_vozd_pipe" label="Сечение для прохода воздуха">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="sechenie_dgas_pipe" label="Сечение для прохода дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="poverhnost_nagreva" label="Условная поверхность нагрева">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="num_pipe_vozd" label="Количество труб по пути воздуха">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="num_pipe_dgas" label="Количество труб по пути дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="num_moves" label="Количество ходов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="b" label="B">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="n" label="n">
            <Input type="number" step="0.01" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">Сохранить</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно расчета */}
      <Modal 
        title="Расчет игольчатого рекуператора" 
        open={isModalCalculateOpen} 
        onCancel={() => setIsModalCalculateOpen(false)} 
        footer={null}
        width={800}
      >
        <Form
          layout="vertical"
          form={formCalculate}
          onFinish={onVariantCalculation}
          style={{ maxWidth: '100%' }}
        >
          <Form.Item name="name" label="Название">
            <Input />
          </Form.Item>
          <Form.Item name="rashod_vozduh" label="Объем нагреваемого воздуха при входе в рекуператор">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="rashod_dgas" label="Объем дымовых газов при входе в рекуператор">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temperatura_vozd_nagrev" label="Температура подогрева воздуха у печи">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temperatura_vozd_start" label="Начальная температура воздуха">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temperatura_dgas" label="Температура дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="ohlazhdenie_vozd" label="Падение температуры в воздухопроводе от рекуператора до печи">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="ohlazhdenie_rekuper" label="Потери тепла рекуператора в окружающее пространство">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="temploemkost_dgas" label="Теплоемкость дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="pipe_length" label="Длина труб">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="sechenie_vozd_pipe" label="Сечение для прохода воздуха">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="sechenie_dgas_pipe" label="Сечение для прохода дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="poverhnost_nagreva" label="Условная поверхность нагрева">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="num_pipe_vozd" label="Количество труб по пути воздуха">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="num_pipe_dgas" label="Количество труб по пути дымовых газов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="num_moves" label="Количество ходов">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="b" label="B">
            <Input type="number" step="0.01" />
          </Form.Item>
          <Form.Item name="n" label="n">
            <Input type="number" step="0.01" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">Расчет</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table 
        rowKey="id" 
        dataSource={dataSource} 
        columns={columns} 
        loading={!initialState?.login}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}