export interface NeedlRecuperatorInputModel {
  rashod_vozduh: number;
  rashod_dgas: number;
  temperatura_vozd_nagrev: number;
  temperatura_vozd_start: number;
  temperatura_dgas: number;
  ohlazhdenie_vozd: number;
  ohlazhdenie_rekuper: number;
  temploemkost_dgas: number;
  pipe_length: number;
  sechenie_vozd_pipe: number;
  sechenie_dgas_pipe: number;
  poverhnost_nagreva: number;
  num_pipe_vozd: number;
  num_pipe_dgas: number;
  num_moves: number;
  b: number;
  n: number;
}

export const defaultInputValues: NeedlRecuperatorInputModel = {
  rashod_vozduh: 1340,
  rashod_dgas: 1330,
  temperatura_vozd_nagrev: 300,
  temperatura_vozd_start: 20,
  temperatura_dgas: 750,
  ohlazhdenie_vozd: 20,
  ohlazhdenie_rekuper: 10,
  temploemkost_dgas: 1.47,
  pipe_length: 880,
  sechenie_vozd_pipe: 0.008,
  sechenie_dgas_pipe: 0.042,
  poverhnost_nagreva: 0.25,
  num_pipe_vozd: 9,
  num_pipe_dgas: 3,
  num_moves: 4,
  b: 17,
  n: 1.03,
};