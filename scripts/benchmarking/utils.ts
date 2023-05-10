import { ReturnPromiseType, countDecimals } from '@abaxfinance/utils';

export const measureTime = async <T>(sampleSize: number, markId: string, benchmarkFunc: () => Promise<T>) => {
  const start = Date.now();
  const intermediateMeasurements: { start: number; end: number; duration: number }[] = [];
  for (let i = 0; i < sampleSize; i++) {
    const intermediateStart = Date.now();
    await benchmarkFunc();
    const intermediateEnd = Date.now();
    intermediateMeasurements.push({ start: intermediateStart, end: intermediateEnd, duration: intermediateEnd - intermediateStart });
  }
  const end = Date.now();
  const sum = intermediateMeasurements.map((im) => im.duration).reduce((a, b) => a + b, 0);
  const avg = sum / intermediateMeasurements.length;
  const stdDev = Math.sqrt(
    intermediateMeasurements
      .map((im) => im.duration)
      .map((x) => Math.pow(x - avg, 2))
      .reduce((a, b) => a + b) / intermediateMeasurements.length,
  );

  return { name: markId, start, end, duration: end - start, avg, stdDev };
};

export const logProgress = (total: number, current: number) => {
  const currentProgress = (current * 100) / total;
  if (currentProgress !== 0 && currentProgress % 5 === 0) {
    console.log(`${currentProgress}% done... (${current} out of ${total} data points)`);
  }
};

export class TimeSpanFormatter {
  private overrideMsFormattingIfHasDecimals = true;
  private rtf: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat('en', { style: 'long' });
  private tokensRtf: Set<string> = new Set();
  private tokens = /[Dhmsf][#~]?|"[^"]*"|'[^']*'/g;
  private tokensWithParams: { t: { token: string; fmt?: Intl.RelativeTimeFormatUnit | number }[]; milisPerTimeUnit: number }[] = [
    {
      t: [
        {
          token: 'D',
          fmt: 1,
        },
        {
          token: 'D#',
        },
        {
          token: 'D~',
          fmt: 'day',
        },
      ],
      milisPerTimeUnit: 86400000,
    },
    {
      t: [
        {
          token: 'h',
          fmt: 2,
        },
        {
          token: 'h#',
        },
        {
          token: 'h~',
          fmt: 'hour',
        },
      ],
      milisPerTimeUnit: 3600000,
    },
    {
      t: [
        {
          token: 'm',
          fmt: 2,
        },
        {
          token: 'm#',
        },
        {
          token: 'm~',
          fmt: 'minute',
        },
      ],
      milisPerTimeUnit: 60000,
    },
    {
      t: [
        {
          token: 's',
          fmt: 2,
        },
        {
          token: 's#',
        },
        {
          token: 's~',
          fmt: 'second',
        },
      ],
      milisPerTimeUnit: 1000,
    },
    {
      t: [
        {
          token: 'f',
          fmt: 3,
        },
        {
          token: 'f#',
        },
        {
          token: 'f~',
        },
      ],
      milisPerTimeUnit: 1,
    },
  ];
  constructor() {
    this.setLocale('en');
  }
  setLocale = (value: string | string[] | undefined, style: Intl.RelativeTimeFormatStyle = 'long') => {
    this.rtf = new Intl.RelativeTimeFormat(value, { style });
    const h = this.rtf.format(1, 'hour').split(' ');
    this.tokensRtf = new Set(
      this.rtf
        .format(1, 'day')
        .split(' ')
        .filter((t) => t.toString() !== '1' && h.indexOf(t) > -1),
    );
    return true;
  };
  setOverrideMsFormattingIfHasDecimals = (overrideMsFormattingIfHasDecimals: boolean) =>
    (this.overrideMsFormattingIfHasDecimals = overrideMsFormattingIfHasDecimals);

  private paddingFormatter = (fmt: number, amountOfTimeUnits: number) => {
    return amountOfTimeUnits.toString().padStart(fmt, '0');
  };
  private fmtFormatter = (fmt: Intl.RelativeTimeFormatUnit, amountOfTimeUnits: number) => {
    return this.rtf
      .format(amountOfTimeUnits, fmt)
      .split(' ')
      .filter((token) => !this.tokensRtf.has(token))
      .join(' ')
      .trim()
      .replace(/[+-]/g, '');
  };
  private formatToken = (amountOfTimeUnits: number, fmt?: number | Intl.RelativeTimeFormatUnit) => {
    if (typeof fmt === 'string') return this.fmtFormatter(fmt, amountOfTimeUnits);
    if (typeof fmt === 'number') return this.paddingFormatter(fmt, amountOfTimeUnits);
    return amountOfTimeUnits;
  };
  format = (pattern: string, timeSpan: number) => {
    if (typeof pattern !== 'string') throw Error('invalid pattern');
    if (!Number.isFinite(timeSpan)) throw Error('invalid value');
    if (!pattern) return '';
    const outValues: Record<string, string | null> = {};
    let timeSpanAbs = Math.abs(timeSpan);
    pattern.match(this.tokens)?.forEach((t) => (outValues[t] = null));
    this.tokensWithParams.forEach((m) => {
      let amountOfTimeUnits: number | null = null;
      m.t.forEach((t) => {
        if (outValues[t.token] !== null) return;
        if (t.token === 'f' && typeof t.fmt === 'number' && this.overrideMsFormattingIfHasDecimals) {
          if (amountOfTimeUnits === null) {
            const numberOfDecimals = countDecimals(timeSpanAbs);
            if (numberOfDecimals > 0) {
              outValues[t.token] = this.formatToken(timeSpanAbs, t.fmt + numberOfDecimals).toString();
              timeSpanAbs %= m.milisPerTimeUnit;
              return;
            }
            amountOfTimeUnits = Math.floor(timeSpanAbs / m.milisPerTimeUnit);
            timeSpanAbs %= m.milisPerTimeUnit;
          }
          outValues[t.token] = this.formatToken(amountOfTimeUnits, t.fmt).toString();
          return;
        }

        if (amountOfTimeUnits === null) {
          amountOfTimeUnits = Math.floor(timeSpanAbs / m.milisPerTimeUnit);
          timeSpanAbs %= m.milisPerTimeUnit;
        }
        outValues[t.token] = this.formatToken(amountOfTimeUnits, t.fmt).toString();
      });
    });
    return pattern.replace(this.tokens, (t) => {
      return outValues[t] || t.slice(1, t.length - 1);
    });
  };
}

export const printWithTime = (formatter: TimeSpanFormatter, o: ReturnPromiseType<typeof measureTime>) =>
  console.table(
    Object.fromEntries(
      Object.entries(o).map(([k, v]) => [
        k,
        k === 'start' || k === 'end' ? new Date(v).toISOString() : typeof v === 'number' ? formatter.format('h:m:s.f', v) : v,
      ]),
    ),
  );
