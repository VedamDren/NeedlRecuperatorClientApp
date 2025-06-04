import { NeedlRecuperatorInputModel } from '@/models/inputModel';
import { NeedlRecuperatorResultModel } from '@/models/resultModel';
import { request } from '@umijs/max';
import { Button, Form, Input, message, Modal, Popconfirm, Radio, Result, Select, Space, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';
import { __values } from 'tslib';
import { history } from 'umi';



export default function HomePage() {
  /*curl -X 'POST' \
    'http://localhost:5210/api/Recuperator/Calculate/calculate' \
    -H 'accept: ' \
    -H 'Content-Type: application/json' \
    -d '{
  }' */

  const columns: TableProps<any>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: 'Название',
      dataIndex: 'name'
    },
    //<DeleteOutlined />
    {
      title: 'Действие',
      key: 'acton',
      render: (value, record, index) => <Space>
        <Popconfirm
          title="Удаляем вариант?"
          okText="Да"
          cancelText="Нет"
          onConfirm={() => onRemove(record.id)}
        >
          <a>Удалить</a>
        </Popconfirm>
        <a onClick={() => onCalculation(record.id)}>Рассчитать</a>
      </Space>

    },

  ];

  const [dataSource, setDataSource] = useState<any[]>([]);
  const [creatorOptions, setCreatorOptions] = useState<any[]>([]);

  useEffect(() => {

    updateData({});

    request('/api/User/GetAll', { method: 'GET' }).then((result: any[]) => {
      const options = result.map((item: any) => ({ value: item.id, label: item.name }));
      setCreatorOptions(options)
    });

    //localStorage.setItem('super_key', 'super_value')
    sessionStorage.setItem('super_key', 'super_value')

  }, [])

  //Рассчет
  const onCalculation = (id: number) => {
    setIsModalCalculateOpen(true)
    request(`/api/Recuperator/GetVariant/variants/${id}`, { method: 'GET' }).then((result: any) => {
      formCalculate.setFieldsValue(result)
    });
  }
  const onVariantCalculation = async (data: NeedlRecuperatorInputModel) => {
    try {
      // Отправляем данные расчета
      const result = await request<NeedlRecuperatorResultModel>(
        '/api/Recuperator/Calculate/calculate', 
        {
          method: 'POST',
          data, // Передаем данные из формы
        }
      );
  
      // Перенаправляем на страницу результатов
      history.push('/result', {
        inputData: data,
        resultData: result
      });
      
      // Закрываем модальное окно
      setIsModalCalculateOpen(false);
  
    } catch (error) {
      message.error('Ошибка расчета');
    }
  };

  //полчуить список вариантов
  const updateData = (data: any) => {
    console.log('Поиск...')
    console.log(data)

    request('/api/Recuperator/GetAllVariantsPost/variants/', { data: data, method: 'POST', headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`} }).then((result: any[]) => {
      setDataSource(result)
    });
  }

  //Удаление варианта
  const onRemove = (id: number) => {

    console.log('Удаляем вариант id = ' + id)
    request(`/api/Recuperator/DeleteVariant/variants/${id}`, { method: 'DELETE' }).then((result: any[]) => {

      const newDataSource = dataSource?.filter(item => item.id != id)
      setDataSource(newDataSource)

    });
  }
  //Функции для сохранения варианта.
  const onVariantAdd = (data: any) => {
    console.log(data);
    request('/api/Recuperator/SaveVariant/', { data, method: 'PUT' }).then((result: any[]) => {
      setIsModalOpen(false)

      const newVariants = [result, ...dataSource];
      setDataSource(newVariants)
      message.success("Новый вариант добавлен");
    }).catch((e: any) => {
      message.error(e);
    }).finally(() => {
      setIsModalOpen(false)
    });
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCalculateOpen, setIsModalCalculateOpen] = useState(false);
  const [formCalculate] = Form.useForm();

  return (
    <div>
      <Form
        layout='inline'
        onFinish={updateData}

      >

        <Form.Item label="Создал" className="input.inline">
          <Select
            allowClear
            options={creatorOptions}
            style={{ width: '200px' }}
          />
        </Form.Item>

        <Form.Item name="name" label="Название" className="input.inline">
          <Input placeholder="Введите название варианта" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Найти</Button>
        </Form.Item>
      </Form>

      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Новый вариант
      </Button>
      <Modal title="Добавление нового варианта" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form
          layout="horizontal"
          labelCol={{ span: 20 }}
          onFinish={onVariantAdd}
          style={{ maxWidth: 900 }}

        >

          <Form.Item hasFeedback name="name" label="Название"

            validateDebounce={1000}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="rashod_vozduh" label="Объем нагреваемого воздуха при входе в рекуператор"
            validateDebounce={1000}
          //rules={[{ max: 3 }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="rashod_dgas" label="Объем дымовых газов при входе в рекуператор"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temperatura_vozd_nagrev" label="Температура подогрева воздуха у печи"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temperatura_vozd_start" label="Начальная температура воздуха"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temperatura_dgas" label="Температура дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="ohlazhdenie_vozd" label="Падение температуры в воздухопроводе от рекуператора до печи"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="ohlazhdenie_rekuper" label="Потери тепла рекуператора в окружающее пространство"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temploemkost_dgas" label="Теплоемкость дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="pipe_length" label="Длина труб"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="sechenie_vozd_pipe" label="Сечение для прохода воздуха"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="sechenie_dgas_pipe" label="Сечение для прохода дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="poverhnost_nagreva" label="Условная поверхность нагрева"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="num_pipe_vozd" label="Количество труб по пути воздуха"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="num_pipe_dgas"
            label="Количество труб по пути дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="num_moves"
            label="Количество ходов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="b"
            label="B"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="n"
            label="n"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Сохранить</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Расчет игольчатого рекуператора" open={isModalCalculateOpen} onCancel={() => setIsModalCalculateOpen(false)} footer={null}>
        <Form
          layout="horizontal"
          labelCol={{ span: 20 }}
          form={formCalculate}
          onFinish={onVariantCalculation}
          style={{ maxWidth: 900 }}
        >

          <Form.Item hasFeedback name="name" label="Название"

            validateDebounce={1000}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="rashod_vozduh" label="Объем нагреваемого воздуха при входе в рекуператор"
            validateDebounce={1000}
          //rules={[{ max: 3 }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="rashod_dgas" label="Объем дымовых газов при входе в рекуператор"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temperatura_vozd_nagrev" label="Температура подогрева воздуха у печи"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temperatura_vozd_start" label="Начальная температура воздуха"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temperatura_dgas" label="Температура дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="ohlazhdenie_vozd" label="Падение температуры в воздухопроводе от рекуператора до печи"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="ohlazhdenie_rekuper" label="Потери тепла рекуператора в окружающее пространство"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="temploemkost_dgas" label="Теплоемкость дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="pipe_length" label="Длина труб"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="sechenie_vozd_pipe" label="Сечение для прохода воздуха"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="sechenie_dgas_pipe" label="Сечение для прохода дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="poverhnost_nagreva" label="Условная поверхность нагрева"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item hasFeedback name="num_pipe_vozd" label="Количество труб по пути воздуха"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="num_pipe_dgas"
            label="Количество труб по пути дымовых газов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="num_moves"
            label="Количество ходов"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="b"
            label="B"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item
            hasFeedback
            name="n"
            label="n"
            validateDebounce={1000}
          //rules={[{  }]}
          >
            <Input style={{ width: '90px' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Расчет</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table rowKey="id" dataSource={dataSource} columns={columns} />;
    </div>
  );
}
