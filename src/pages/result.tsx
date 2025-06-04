import React from 'react';
import { history } from 'umi';
import { Card, Descriptions, Button } from 'antd';
import { NeedlRecuperatorInputModel } from '@/models/inputModel';
import { NeedlRecuperatorResultModel } from '@/models/resultModel';
import { useLocation } from 'umi';

const ResultPage: React.FC = () => {
  const location = useLocation();
  
  // Правильное приведение типа
  const state = location.state as {
    inputData: NeedlRecuperatorInputModel;
    resultData: NeedlRecuperatorResultModel;
  } | undefined;

  if (!state) {
    return <div>Данные не найдены</div>;
  }

  const { inputData, resultData } = state;

  // Исправленный вызов history.push
  const goBack = () => {
    history.push('/input', { inputData });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Button type="primary" onClick={goBack} style={{ marginBottom: 16 }}>
        Назад к вводу
      </Button>

      <Card title="Результаты расчета" bordered={false}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Температура подогрева воздуха в рекуператоре">
            {resultData.temperature_podogrev_vozd?.toFixed(2)} °C
          </Descriptions.Item>
          <Descriptions.Item label="Средняя объемная теплоемкость воздуха">
            {resultData.sr_teploemkost_vozd?.toFixed(2)} кДж/(м3*°С)
          </Descriptions.Item>
          <Descriptions.Item label="Энтальпия воздуха">
            {resultData.entalpia_vozd?.toFixed(2)} Вт
          </Descriptions.Item>
          <Descriptions.Item label="Количество тепла, которое должны отдать дымовые газы">
            {resultData.dgas_heat?.toFixed(2)} Вт
          </Descriptions.Item>
          <Descriptions.Item label="Средняя объемная теплоемкость дымовых газов">
            {resultData.sr_teploemkost_dgas?.toFixed(2)} кДж/(м3*°С)
          </Descriptions.Item>
          <Descriptions.Item label="Энтальпия дымовых газов, входящих в рекуператор">
            {resultData.entalpia_dgas_in?.toFixed(2)} Вт
          </Descriptions.Item>
          <Descriptions.Item label="Часовая энтальпия дымовых газов, уходящих из рекуператора">
            {resultData.h_entalpia_dgas_out?.toFixed(2)} Вт
          </Descriptions.Item>
          <Descriptions.Item label="Температура дымовых газов, уходящих из рекуператора">
            {resultData.temperatura_dgas_out?.toFixed(2)} °С
          </Descriptions.Item>
          <Descriptions.Item label="Средняя логарифмическая начальная температура">
            {resultData.sr_log_start_temperature?.toFixed(2)} °С
          </Descriptions.Item>
          <Descriptions.Item label="Средняя логарифмическая конечная температура">
            {resultData.sr_log_fin_temperature?.toFixed(2)} °С
          </Descriptions.Item>
          <Descriptions.Item label="Средняя логарифмическая разность температур">
            {resultData.sr_log_temperature_dif?.toFixed(2)} °С
          </Descriptions.Item>
          <Descriptions.Item label="Общее сечение каналов для прохождения воздуха">
            {resultData.pipe_vozd_sech?.toFixed(2)} м2
          </Descriptions.Item>
          <Descriptions.Item label="Общее сечение для прохождения дымовых газов">
            {resultData.pipe_dgas_sech?.toFixed(2)} м2
          </Descriptions.Item>
          <Descriptions.Item label="Действительная скорость воздуха">
            {resultData.vozd_speed?.toFixed(2)} м/с
          </Descriptions.Item>
          <Descriptions.Item label="Действительная скорость дымовых газов">
            {resultData.dgas_speed?.toFixed(2)} м/с
          </Descriptions.Item>
          <Descriptions.Item label="Коэффициент теплоотдачи от дымовых газов к стенке рекуператора">
            {resultData.koef_teplootdachi_dgas?.toFixed(2)} Вт/(м2*°С)
          </Descriptions.Item>
          <Descriptions.Item label="Коэффициент теплоотдачи от стенки рекуператора к нагревающемуся воздуху">
            {resultData.koef_teplootdachi_vozd?.toFixed(2)} Вт/(м2*°С)
          </Descriptions.Item>
          <Descriptions.Item label="Коэффициент теплопередачи">
            {resultData.koef_teploperedachi?.toFixed(2)} Вт/(м2*°С)
          </Descriptions.Item>
          <Descriptions.Item label="Поверхность нагрева рекуператора">
            {resultData.f_rekuperator?.toFixed(2)} м2
          </Descriptions.Item>
          <Descriptions.Item label="Общее количество труб">
            {resultData.pipe_num?.toFixed(2)} шт
          </Descriptions.Item>
          <Descriptions.Item label="Поверхность нагрева рекуператора принятой конструкции">
            {resultData.f_confermed_recuperator?.toFixed(2)} м2
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ResultPage;