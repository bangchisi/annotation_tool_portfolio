import { axiosErrorHandler } from 'helpers/Axioshelpers';
import FinetuneModel from 'models/Finetune.model';
import { LogType } from 'routes/Models/Models';

export async function getIsOnTrain(userId: string, datasetId: number) {
  try {
    const response = await FinetuneModel.getLogs(userId);
    const logs = response.data as LogType[];

    const log = logs.find((log) => log.datasetId === datasetId && !log.isDone);

    if (!log) return false;

    return true;
  } catch (error) {
    axiosErrorHandler(error, 'Failed to get onTrain flag');
    return false;
  }
}
