import { Link, Outlet, useModel, history } from 'umi';
import { Layout, Menu, theme, message } from 'antd';
import './index.less';

const { Header, Content, Footer } = Layout;

export default function () {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  // Функция выхода из системы
  const onExit = () => {
    try {
      // Очищаем данные пользователя из localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('login');
      
      // Сбрасываем состояние приложения
      setInitialState({ login: undefined, userId: undefined } as any);
      
      // Показываем сообщение об успешном выходе
      message.success('Вы успешно вышли из системы');
      
      // Перенаправляем на главную страницу
      setTimeout(() => {
        history.push('/');
      }, 500);
      
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      message.error('Произошла ошибка при выходе из системы');
    }
  };

  // Элементы меню навигации
  const menuItems = [
    {
      key: 'home',
      label: <Link to="/">Главная</Link>,
    },
    {
      key: 'input',
      label: <Link to="/input">Расчет</Link>,
    },
    {
      key: 'variants',
      label: <Link to="/variants">Мои варианты</Link>, // Исправлено: ведет на страницу вариантов
    },
    {
      key: 'auth',
      // Если пользователь авторизован - показываем кнопку "Выход", иначе - "Войти"
      label: initialState?.login ? (
        <a 
          onClick={onExit}
          style={{ color: 'inherit' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1890ff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
        >
          Выход ({initialState.login})
        </a>
      ) : (
        <Link to="/auth">Войти</Link>
      ),
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['home']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '0 48px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {/* Outlet для отображения дочерних страниц */}
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        УрФУ ©{new Date().getFullYear()} Теплотехнический расчет игольчатого рекуператора
      </Footer>
    </Layout>
  );
}