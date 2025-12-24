import React, { useRef } from 'react';
import { history, useLocation } from 'umi';
import { Card, Descriptions, Button, Row, Col, message } from 'antd';
import { useModel } from '@umijs/max';
import { Column } from '@ant-design/charts';
import { NeedlRecuperatorInputModel } from '@/models/inputModel';
import { NeedlRecuperatorResultModel } from '@/models/resultModel';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const pdfRef = useRef<HTMLDivElement>(null);
  const { initialState } = useModel('@@initialState');
  
  const state = location.state as {
    inputData: NeedlRecuperatorInputModel;
    resultData: NeedlRecuperatorResultModel;
  } | undefined;

  if (!state) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Card>
          <h2>Данные не найдены</h2>
          <p>Пожалуйста, выполните расчет сначала</p>
          <Button type="primary" onClick={() => history.push('/input')}>
            Перейти к расчету
          </Button>
        </Card>
      </div>
    );
  }

  const { inputData, resultData } = state;

  const goBack = () => {
    history.push('/input', { inputData });
  };

  const saveAsPDF = async () => {
    try {
      // Динамический импорт библиотек
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      if (!pdfRef.current) {
        message.error('Не удалось создать PDF');
        return;
      }

      message.loading({ content: 'Создание PDF...', key: 'pdf', duration: 0 });

      // СОЗДАЕМ КЛОНА ЭЛЕМЕНТА С ФИКСИРОВАННЫМИ РАЗМЕРАМИ
      const originalElement = pdfRef.current;
      const clone = originalElement.cloneNode(true) as HTMLElement;
      
      // Устанавливаем фиксированные стили для клона
      clone.style.width = '794px'; // Ширина A4 в пикселях (210mm * 96DPI / 25.4)
      clone.style.position = 'fixed';
      clone.style.left = '-9999px'; // Выносим за экран
      clone.style.top = '0';
      clone.style.zIndex = '9999';
      clone.style.background = 'white';
      clone.style.padding = '40px';
      clone.style.boxSizing = 'border-box';
      clone.style.fontSize = '14px'; // Фиксированный размер шрифта
      clone.style.lineHeight = '1.4';
      clone.style.fontFamily = 'Arial, sans-serif';
      
      // Применяем фиксированные стили ко всем внутренним элементам
      const allElements = clone.querySelectorAll('*');
      allElements.forEach((el: Element) => {
        const element = el as HTMLElement;
        element.style.boxSizing = 'border-box';
        // Сохраняем только важные стили, сбрасываем трансформации
        element.style.transform = 'none';
        element.style.transformOrigin = 'unset';
        element.style.transition = 'none';
        element.style.animation = 'none';
      });
      
      // Добавляем клон в DOM
      document.body.appendChild(clone);

      // Ждем немного для применения стилей
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(clone, {
        scale: 2, // Высокое качество
        useCORS: true,
        logging: false,
        width: 794, // Фиксированная ширина
        windowWidth: 794, // Фиксированная ширина окна
        backgroundColor: '#ffffff'
      });

      // Удаляем клон из DOM
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Ширина A4 в мм
      const pageHeight = 295; // Высота A4 в мм
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Добавляем новые страницы если контент не помещается
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      pdf.save(`расчет_игольчатого_рекуператора_${timestamp}.pdf`);
      
      message.success({ content: 'PDF успешно сохранен', key: 'pdf' });
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      message.error({ content: 'Ошибка при создании PDF', key: 'pdf' });
    }
  };

  // Данные для диаграммы температур
  const temperatureData = [
    { parameter: 'Подогрев воздуха', value: resultData.temperature_podogrev_vozd?.toFixed(2) || 0, unit: '°C' },
    { parameter: 'Дым. газы на выходе', value: resultData.temperatura_dgas_out?.toFixed(2) || 0, unit: '°C' },
    { parameter: 'Ср. лог. нач. темп.', value: resultData.sr_log_start_temperature?.toFixed(2) || 0, unit: '°C' },
    { parameter: 'Ср. лог. кон. темп.', value: resultData.sr_log_fin_temperature?.toFixed(2) || 0, unit: '°C' },
    { parameter: 'Ср. лог. разность', value: resultData.sr_log_temperature_dif?.toFixed(2) || 0, unit: '°C' },
  ];

  // Данные для диаграммы скоростей
  const speedData = [
    { parameter: 'Скорость воздуха', value: resultData.vozd_speed?.toFixed(2) || 0, unit: 'м/с' },
    { parameter: 'Скорость дым. газов', value: resultData.dgas_speed?.toFixed(2) || 0, unit: 'м/с' },
  ];

  // Данные для диаграммы коэффициентов
  const coefficientData = [
    { parameter: 'Теплоотдача дым. газов', value: resultData.koef_teplootdachi_dgas?.toFixed(2) || 0, unit: 'Вт/(м²·°C)' },
    { parameter: 'Теплоотдача воздуха', value: resultData.koef_teplootdachi_vozd?.toFixed(2) || 0, unit: 'Вт/(м²·°C)' },
    { parameter: 'Теплопередача', value: resultData.koef_teploperedachi?.toFixed(2) || 0, unit: 'Вт/(м²·°C)' },
  ];

  // Данные для диаграммы поверхностей
  const surfaceData = [
    { parameter: 'Поверхность нагрева', value: resultData.f_rekuperator?.toFixed(2) || 0, unit: 'м²' },
    { parameter: 'Поверхность принятой конструкции', value: resultData.f_confermed_recuperator?.toFixed(2) || 0, unit: 'м²' },
  ];

  // Конфигурация для столбчатых диаграмм
  const chartConfig = {
    height: 300,
    xField: 'parameter',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`,
      },
    },
    meta: {
      value: {
        alias: 'Значение',
      },
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" onClick={goBack}>
            Назад к вводу
          </Button>
        </Col>
        <Col>
          {initialState?.login && (
            <Button type="default" onClick={saveAsPDF} style={{ marginLeft: 8 }}>
              Сохранить в PDF
            </Button>
          )}
        </Col>
      </Row>

      {/* Блок информации о авторизации */}
      {!initialState?.login && (
        <div style={{ marginBottom: '20px', padding: '10px', background: '#fff2e8', border: '1px solid #ffbb96', borderRadius: '4px' }}>
          Для сохранения результатов в PDF необходимо войти в систему
        </div>
      )}

      {/* Столбчатые диаграммы для визуализации результатов */}
      <Card title="Визуализация результатов расчета" bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Температуры, °C" size="small">
              <Column
                {...chartConfig}
                data={temperatureData}
                color="#ff4d4f"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Скорости, м/с" size="small">
              <Column
                {...chartConfig}
                data={speedData}
                color="#1890ff"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Коэффициенты теплоотдачи, Вт/(м²·°C)" size="small">
              <Column
                {...chartConfig}
                data={coefficientData}
                color="#52c41a"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Поверхности нагрева, м²" size="small">
              <Column
                {...chartConfig}
                data={surfaceData}
                color="#faad14"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Контент для PDF с простой структурой и фиксированными стилями */}
      <div ref={pdfRef}>
        <div style={{ 
          padding: '40px', 
          fontFamily: 'Arial, sans-serif',
          background: 'white',
          fontSize: '16px', // ФИКСИРОВАННЫЙ размер шрифта
          lineHeight: '1.4',
          boxSizing: 'border-box'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            fontSize: '32px', // ФИКСИРОВАННЫЙ размер
            fontWeight: 'bold'
          }}>
            Расчет игольчатого рекуператора
          </h1>
          
          {/* Информация о пользователе в PDF */}
          {initialState?.login && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              background: '#f5f5f5', 
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>
                <strong>Пользователь:</strong> {initialState.login}
              </p>
            </div>
          )}
          
          <div style={{ 
            marginBottom: '25px', 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            background: '#fafafa'
          }}>
              <h2 style={{ 
              marginBottom: '20px', 
              fontSize: '18px',
              fontWeight: 'bold',
              borderBottom: '2px solid  #1890ff',
              paddingBottom: '8px'
            }}>
             
            </h2>
            <h2 style={{ 
              marginBottom: '20px', 
              fontSize: '22px',
              fontWeight: 'bold',
              borderBottom: '2px solid #1890ff',
              paddingBottom: '8px'
            }}>
              Исходные параметры:
            </h2>
            <div style={{ lineHeight: '1.6' }}>
              {[
                ['Объем нагреваемого воздуха', `${inputData.rashod_vozduh} м³/ч`],
                ['Объем дымовых газов', `${inputData.rashod_dgas} м³/ч`],
                ['Температура подогрева воздуха у печи', `${inputData.temperatura_vozd_nagrev} °C`],
                ['Начальная температура воздуха', `${inputData.temperatura_vozd_start} °C`],
                ['Температура дымовых газов', `${inputData.temperatura_dgas} °C`],
                ['Падение температуры в воздухопроводе от рекуператора до печи', `${inputData.ohlazhdenie_vozd} °C`],
                ['Потери тепла рекуператора в окружающее пространство', `${inputData.ohlazhdenie_rekuper} %`],
                ['Теплоемкость дымовых газов', `${inputData.temploemkost_dgas} кДж/(м³·°С)`],
                ['Длина труб', `${inputData.pipe_length} мм`],
                ['Сечение для прохода воздуха', `${inputData.sechenie_vozd_pipe} м²`],
                ['Сечение для прохода дымовых газов', `${inputData.sechenie_dgas_pipe} м²`],
                ['Условная поверхность нагрева', `${inputData.poverhnost_nagreva} м²`],
                ['Количество труб по пути воздуха', `${inputData.num_pipe_vozd} шт.`],
                ['Количество труб по пути дымовых газов', `${inputData.num_pipe_dgas} шт.`],
                ['Количество ходов', `${inputData.num_moves}`],
                ['Эмпирический коэффициент для расчета теплоотдачи B', `${inputData.b}`],
                ['Эмпирический коэффициент для расчета теплоотдачи n', `${inputData.n}`],
              ].map(([label, value], index) => (
                <p key={index} style={{ 
                  fontSize: '16px', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dotted #eee',
                  paddingBottom: '7px'
                }}>
                  <strong>{label}:</strong>
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>
          

          <div style={{ 
            marginBottom: '25px', 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '5px',
            background: '#fafafa'
          }}>
              <h2 style={{ 
              marginBottom: '20px', 
              fontSize: '18px',
              fontWeight: 'bold',
              borderBottom: '2px solid #52c41a',
              paddingBottom: '8px'
            }}>
              
            </h2>
            <h2 style={{ 
              marginBottom: '20px', 
              fontSize: '22px',
              fontWeight: 'bold',
              borderBottom: '2px solid #52c41a',
              paddingBottom: '8px'
            }}>
              Результаты расчета:
            </h2>
            <div style={{ lineHeight: '1.6' }}>
              {[
                ['Температура подогрева воздуха в рекуператоре', `${resultData.temperature_podogrev_vozd?.toFixed(2)} °C`],
                ['Средняя объемная теплоемкость воздуха', `${resultData.sr_teploemkost_vozd?.toFixed(2)} кДж/(м³·°С)`],
                ['Энтальпия воздуха', `${resultData.entalpia_vozd?.toFixed(2)} Вт`],
                ['Тепло от дымовых газов', `${resultData.dgas_heat?.toFixed(2)} Вт`],
                ['Средняя объемная теплоемкость дымовых газов', `${resultData.sr_teploemkost_dgas?.toFixed(2)} кДж/(м³·°С)`],
                ['Энтальпия дымовых газов на входе', `${resultData.entalpia_dgas_in?.toFixed(2)} Вт`],
                ['Энтальпия дымовых газов на выходе', `${resultData.h_entalpia_dgas_out?.toFixed(2)} Вт`],
                ['Температура дымовых газов на выходе', `${resultData.temperatura_dgas_out?.toFixed(2)} °С`],
                ['Средняя логарифмическая начальная температура', `${resultData.sr_log_start_temperature?.toFixed(2)} °С`],
                ['Средняя логарифмическая конечная температура', `${resultData.sr_log_fin_temperature?.toFixed(2)} °С`],
                ['Средняя логарифмическая разность температур', `${resultData.sr_log_temperature_dif?.toFixed(2)} °С`],
                ['Общее сечение каналов для воздуха', `${resultData.pipe_vozd_sech?.toFixed(2)} м²`],
                ['Общее сечение для дымовых газов', `${resultData.pipe_dgas_sech?.toFixed(2)} м²`],
                ['Скорость воздуха', `${resultData.vozd_speed?.toFixed(2)} м/с`],
                ['Скорость дымовых газов', `${resultData.dgas_speed?.toFixed(2)} м/с`],
                ['Коэффициент теплоотдачи от дымовых газов', `${resultData.koef_teplootdachi_dgas?.toFixed(2)} Вт/(м²·°С)`],
                ['Коэффициент теплоотдачи к воздуху', `${resultData.koef_teplootdachi_vozd?.toFixed(2)} Вт/(м²·°С)`],
                ['Коэффициент теплопередачи', `${resultData.koef_teploperedachi?.toFixed(2)} Вт/(м²·°С)`],
                ['Поверхность нагрева рекуператора', `${resultData.f_rekuperator?.toFixed(2)} м²`],
                ['Общее количество труб', `${resultData.pipe_num?.toFixed(0)} шт`],
                ['Поверхность нагрева принятой конструкции', `${resultData.f_confermed_recuperator?.toFixed(2)} м²`],
              ].map(([label, value], index) => (
                <p key={index} style={{ 
                  fontSize: '16px', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px dotted #eee',
                  paddingBottom: '3px'
                }}>
                  <strong>{label}:</strong>
                  <span>{value}</span>
                </p>
              ))}
            </div>
          </div>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '30px', 
            color: '#666', 
            fontSize: '12px',
            borderTop: '1px solid #ddd',
            paddingTop: '5px'
          }}>
            <p>Дата расчета: {new Date().toLocaleString('ru-RU')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;