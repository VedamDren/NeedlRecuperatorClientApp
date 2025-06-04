import { request } from "@umijs/max";
import { Button, Form, Input, message, Modal, Popconfirm, Radio, Result, Select, Space, Table, TableProps } from 'antd';
import { useEffect, useState } from 'react';


export default function HomePage() {

    const loginHandler = (data: any) => {
        request('/api/User/Login', { method: 'POST', data}).then((result: any) => {
            if(result.status != 0) {
                message.error("Вход не выполнен")
            }

            localStorage.setItem('token', result.token)
            message.success("Вход успешно выполнен")
        })
    }
    return (
        <div>
            <Form
                layout="inline"
                onFinish={loginHandler}
            >
                <Form.Item name="login" label="Логин" className="input-inline">
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Пароль" className="input-inline">
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Войти</Button>
                </Form.Item>
            </Form>
        </div>
    );
}