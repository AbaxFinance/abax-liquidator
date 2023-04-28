export const measureTime = async <T>(sampleSize: number, markId: string, benchmarkFunc: () => Promise<T>) => {
  console.log('Starting benchmarking func...');
  const start = Date.now();
  for (let i = 0; i <= sampleSize; i++) {
    await benchmarkFunc();
  }
  const end = Date.now();

  return { name: markId, start, end, duration: end - start };
};

export const logProgress = (total: number, current: number) => {
  const currentProgress = (current * 100) / total;
  if (currentProgress !== 0 && currentProgress % 5 === 0) {
    console.log(`${currentProgress}% done... (${current} out of ${total} data points)`);
  }
};
