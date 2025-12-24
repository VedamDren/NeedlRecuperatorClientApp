import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { CalculatorOutlined, UserOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { history } from 'umi';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const { initialState } = useModel('@@initialState');

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
      {/* Заголовок */}
      <div style={{ marginBottom: '60px' }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '16px' }}>
          Теплотехнический расчет игольчатого рекуператора
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          Произведите точный теплотехнический расчет игольчатого рекуператора для оптимизации энергоэффективности вашего оборудования
        </Paragraph>
      </div>

      {/* Блок информации о пользователе */}
      {initialState?.login && (
        <Card
          style={{
            maxWidth: '500px',
            margin: '0 auto 40px',
            background: '#f0f8ff',
            border: '1px solid #1890ff'
          }}
        >
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            Вы вошли как: <span style={{ color: '#1890ff' }}>{initialState.login}</span>
          </div>
        </Card>
      )}

      {/* Основные кнопки */}
      <Row gutter={[32, 32]} justify="center" style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            bodyStyle={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
            onClick={() => history.push('/input')}
          >
            <CalculatorOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={3} style={{ marginBottom: '8px' }}>Расчет</Title>
            <Paragraph style={{ color: '#666', textAlign: 'center' }}>
              Выполнить новый теплотехнический расчет рекуператора
            </Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            bodyStyle={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}
            onClick={() => history.push(initialState?.login ? '/variants' : '/auth')}
          >
            <DatabaseOutlined style={{ fontSize: '48px', color: initialState?.login ? '#52c41a' : '#faad14', marginBottom: '16px' }} />
            <Title level={3} style={{ marginBottom: '8px' }}>
              {initialState?.login ? 'Мои варианты' : 'Авторизация'}
            </Title>
            <Paragraph style={{ color: '#666', textAlign: 'center' }}>
              {initialState?.login
                ? 'Просмотр и управление сохраненными вариантами расчетов'
                : 'Войдите в систему для доступа к сохраненным вариантам'
              }
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Информационные карточки */}
      <Row gutter={[24, 24]} style={{ marginTop: '60px' }}>
        <Col xs={24} md={8}>
          <Card title="Точность расчетов" size="small">
            <Paragraph style={{ textAlign: 'left' }}>
              Используются проверенные методики и формулы для обеспечения максимальной точности теплотехнических расчетов
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Сохранение вариантов" size="small">
            <Paragraph style={{ textAlign: 'left' }}>
              Все расчеты сохраняются в вашем аккаунте для последующего использования и сравнения
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Экспорт результатов" size="small">
            <Paragraph style={{ textAlign: 'left' }}>
              Возможность экспорта результатов расчета в PDF формате для отчетности и документации
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
}