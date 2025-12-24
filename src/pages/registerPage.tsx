import { request } from "@umijs/max";
import { Button, Form, Input, message, Card, Row, Col } from 'antd';
import { history } from "@umijs/max";

export default function RegisterPage() {
    const [form] = Form.useForm();

    const registerHandler = async (formData: any) => {
        try {
            console.log('Отправка данных регистрации:', formData);
            
            // Отправляем запрос на регистрацию
            const response = await request('/api/Auth/Register', {
                method: 'POST',
                data: formData
            });

            console.log('Ответ сервера:', response);

            if (response.status === 0) {
                // Регистрация успешна
                message.success(response.message || "Регистрация выполнена успешно");
                
                // Перенаправляем на страницу входа
                setTimeout(() => {
                    history.push('/login');
                }, 2000);
            } else {
                // Ошибка регистрации
                message.error(response.message || "Ошибка при регистрации");
            }

        } catch (error: any) {
            // Обрабатываем ошибки сети или сервера
            console.error('Ошибка при регистрации:', error);
            
            if (error.data) {
                // Сервер вернул ошибку с данными
                message.error(error.data.message || "Ошибка при регистрации");
            } else if (error.response) {
                // Сервер вернул ошибку
                const errorData = error.response;
                message.error(errorData.message || "Ошибка при регистрации");
            } else {
                message.error("Ошибка соединения с сервером");
            }
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
                        title={
                            <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                                Регистрация
                            </div>
                        }
                        style={{ 
                            borderRadius: '10px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Form
                            form={form}
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
                                    style={{ width: '100%', marginBottom: '10px' }}
                                >
                                    Зарегистрироваться
                                </Button>
                                
                                <Button 
                                    type="default" 
                                    style={{ width: '100%' }}
                                    onClick={() => history.push('/login')}
                                >
                                    Назад к входу
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}