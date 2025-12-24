import { request, useModel } from "@umijs/max";
import { Button, Form, Input, message, Card, Row, Col, Tabs } from 'antd';
import { history } from "@umijs/max";
import { useState } from 'react';

const { TabPane } = Tabs;

export default function HomePage() {
    const { setInitialState } = useModel('@@initialState');
    const [activeTab, setActiveTab] = useState('login');
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const loginHandler = async (formData: any) => {
        try {
            const response = await request('/api/Auth/Login', { 
                method: 'POST',
                data: formData
            });

            if (response.status === 0) {
                setInitialState({ 
                    login: response.login,
                    userId: response.userId
                } as any);
                
                localStorage.setItem('token', response.token);
                localStorage.setItem('userId', response.userId.toString());
                localStorage.setItem('login', response.login);
                
                message.success("Вход успешно выполнен");
                
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                
            } else {
                message.error("Вход не выполнен: Неверные учетные данные");
                
                setInitialState({} as any);
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('login');
            }
            
        } catch (error) {
            console.error('Ошибка при входе:', error);
            message.error("Ошибка соединения с сервером. Попробуйте позже.");
            
            setInitialState({} as any);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('login');
        }
    };

    const registerHandler = async (formData: any) => {
        try {
            console.log('Отправка данных регистрации:', formData);
            
            const response = await request('/api/Auth/Register', {
                method: 'POST',
                data: formData
            });

            console.log('Ответ сервера:', response);

            if (response.status === 0) {
                message.success(response.message || "Регистрация выполнена успешно");
                
                registerForm.resetFields();
                setActiveTab('login');
                message.info("Теперь вы можете войти в систему");
                
            } else {
                message.error(response.message || "Ошибка при регистрации");
            }

        } catch (error: any) {
            console.error('Ошибка при регистрации:', error);
            
            if (error.data) {
                message.error(error.data.message || "Ошибка при регистрации");
            } else if (error.response) {
                const errorData = error.response;
                message.error(errorData.message || "Ошибка при регистрации");
            } else {
                message.error("Ошибка соединения с сервером");
            }
        }
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        if (key === 'login') {
            registerForm.resetFields();
        } else {
            loginForm.resetFields();
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
                <Col xs={24} sm={16} md={12} lg={8}>
                    <Card 
                        style={{ 
                            borderRadius: '10px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <Tabs 
                            activeKey={activeTab} 
                            onChange={handleTabChange}
                            centered
                            size="large"
                        >
                            <TabPane tab="Вход" key="login">
                                <div style={{ padding: '24px' }}>
                                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                                        Вход в систему
                                    </div>
                                    <Form
                                        form={loginForm}
                                        layout="vertical"
                                        onFinish={loginHandler}
                                        autoComplete="off"
                                        size="large"
                                    >
                                        <Form.Item 
                                            name="login" 
                                            label="Логин"
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: 'Пожалуйста, введите ваш логин' 
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder="Введите ваш логин"
                                            />
                                        </Form.Item>
                                        
                                        <Form.Item 
                                            name="password" 
                                            label="Пароль"
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: 'Пожалуйста, введите ваш пароль' 
                                                }
                                            ]}
                                        >
                                            <Input.Password 
                                                placeholder="Введите ваш пароль"
                                            />
                                        </Form.Item>
                                        
                                        <Form.Item>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit"
                                                style={{ width: '100%' }}
                                            >
                                                Войти в систему
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </TabPane>

                            <TabPane tab="Регистрация" key="register">
                                <div style={{ padding: '24px' }}>
                                    <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                                        Регистрация
                                    </div>
                                    <Form
                                        form={registerForm}
                                        layout="vertical"
                                        onFinish={registerHandler}
                                        autoComplete="off"
                                        size="large"
                                    >
                                        <Form.Item 
                                            name="login" 
                                            label="Логин"
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: 'Пожалуйста, введите логин' 
                                                },
                                                {
                                                    min: 3,
                                                    message: 'Логин должен содержать минимум 3 символа'
                                                },
                                                {
                                                    max: 50,
                                                    message: 'Логин не может превышать 50 символов'
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder="Введите ваш логин"
                                            />
                                        </Form.Item>

                                        <Form.Item 
                                            name="name" 
                                            label="Имя"
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: 'Пожалуйста, введите ваше имя' 
                                                },
                                                {
                                                    max: 50,
                                                    message: 'Имя не может превышать 50 символов'
                                                }
                                            ]}
                                        >
                                            <Input 
                                                placeholder="Введите ваше имя"
                                            />
                                        </Form.Item>
                                        
                                        <Form.Item 
                                            name="password" 
                                            label="Пароль"
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: 'Пожалуйста, введите пароль' 
                                                },
                                                {
                                                    min: 6,
                                                    message: 'Пароль должен содержать минимум 6 символов'
                                                },
                                                {
                                                    max: 100,
                                                    message: 'Пароль не может превышать 100 символов'
                                                }
                                            ]}
                                        >
                                            <Input.Password 
                                                placeholder="Введите ваш пароль"
                                            />
                                        </Form.Item>

                                        <Form.Item 
                                            name="confirmPassword" 
                                            label="Подтверждение пароля"
                                            dependencies={['password']}
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: 'Пожалуйста, подтвердите пароль' 
                                                },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Пароли не совпадают'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password 
                                                placeholder="Повторите ваш пароль"
                                            />
                                        </Form.Item>
                                        
                                        <Form.Item>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit"
                                                style={{ width: '100%' }}
                                            >
                                                Зарегистрироваться
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}