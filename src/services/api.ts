import { NeedlRecuperatorInputModel } from "@/models/inputModel";
import { NeedlRecuperatorResultModel } from "@/models/resultModel";

export const calculateRecuperator = async (
  input: NeedlRecuperatorInputModel
): Promise<NeedlRecuperatorResultModel> => {
  const response = await fetch('api/Recuperator/Calculate/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Ошибка расчета');
  }

  return response.json();
};