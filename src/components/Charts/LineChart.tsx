import {
  Category,
  ChartComponent,
  DataLabel,
  Inject,
  Legend,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
} from '@syncfusion/ej2-react-charts';

interface DataPoint {
  x: string;
  [key: string]: string;
}

interface Props {
  data: any[];
  xColumn: string;
  yColumn: string;
}

const LineChart = ({ data, xColumn, yColumn }: Props) => {
  const chartData: DataPoint[] = data.map((item) => {
    const dataPoint: DataPoint = { x: item[xColumn] };
    dataPoint[yColumn] = item[yColumn];
    return dataPoint;
  });

  const linechart = [
    {
      x: '2021-08-01',
      y: 1,
    },
    {
      x: '2021-08-02',
      y: 2,
    },
    {
      x: '2021-08-03',
      y: 3,
    },
    {
      x: '2021-08-04',
      y: 4,
    },
  ];

  return (
    <ChartComponent
      id='charts'
      width='80%'
      // primaryXAxis={{ valueType: xColumn } as any}
      // primaryYAxis={{ title: yColumn } as any}
      // tooltip={{ enable: true }}
    >
      <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={linechart}
          xName='x'
          yName='y'
          width={2}
          name='ceva'
          type='Line'
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;
