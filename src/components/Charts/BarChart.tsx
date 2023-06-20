import {
  BarSeries,
  Category,
  ChartComponent,
  DataLabel,
  Inject,
  Legend,
  SeriesCollectionDirective,
  SeriesDirective,
  Tooltip,
} from '@syncfusion/ej2-react-charts';

interface Props {
  data: any[];
  xColumn: string;
  yColumn: string;
}

const BarChart = ({ data, xColumn, yColumn }: Props) => {
  return (
    <ChartComponent
      id='bar-chart'
      primaryXAxis={{ title: xColumn }}
      primaryYAxis={{ title: yColumn }}
      title='Bar Chart'
      width='80%'
      tooltip={{ enable: true }}
    >
      <Inject services={[BarSeries, Legend, Tooltip, DataLabel, Category]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={data}
          xName={xColumn}
          yName={yColumn}
          type='Bar'
        ></SeriesDirective>
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default BarChart;
