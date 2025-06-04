export interface NeedlRecuperatorResultModel {
  temperature_podogrev_vozd: number;
  sr_teploemkost_vozd: number;
  entalpia_vozd: number;
  dgas_heat: number;
  sr_teploemkost_dgas: number;
  entalpia_dgas_in: number;
  h_entalpia_dgas_out: number;
  temperatura_dgas_out: number;
  sr_log_start_temperature: number;
  sr_log_fin_temperature: number;
  sr_log_temperature_dif: number;
  pipe_vozd_sech: number;
  pipe_dgas_sech: number;
  vozd_speed: number;
  dgas_speed: number;
  koef_teplootdachi_dgas: number;
  koef_teplootdachi_vozd: number;
  koef_teploperedachi: number;
  f_rekuperator: number;
  pipe_num: number;
  f_confermed_recuperator: number;
}