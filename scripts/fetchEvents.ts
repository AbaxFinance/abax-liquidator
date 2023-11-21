import fs from 'fs-extra';
import path from 'path';
import { EventWithMeta } from 'src/types';

const getOutputPathBase = (dirname = 'scan_results') => path.join(path.parse(__filename).dir, dirname);

export const getPreviousEventsFromFile = (dirname?: string) => {
  try {
    const eventsPath = getEventsLogPath(dirname);
    if (!fs.existsSync(eventsPath)) return [];
    return JSON.parse(fs.readFileSync(eventsPath, 'utf8')) as EventWithMeta[];
  } catch (e) {
    console.warn(`Unable to retrieve eventLog`);
    return [];
  }
};

export const getAnalyzedBlocksFromFile = () => {
  try {
    const prevErrPath = getAnalyzedBlocksPath();
    if (!fs.existsSync(prevErrPath)) return [];
    return JSON.parse(fs.readFileSync(prevErrPath, 'utf-8')) as number[];
  } catch (e) {
    console.warn(`Unable to retrieve pending blocks file`);
    return [];
  }
};
function getAnalyzedBlocksPath() {
  return path.join(getOutputPathBase(), `analyzedBlocks.json`);
}

function getEventsLogPath(dirname?: string) {
  return path.join(getOutputPathBase(dirname), `eventLog.json`);
}
