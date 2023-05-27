import {
  ChartComponent,
  LineSeries,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  DateTime,
  Legend,
  Tooltip,
  ValueType,
  EdgeLabelPlacement,
  IntervalType,
  ChartRangePadding,
} from '@syncfusion/ej2-react-charts';

import {
  lineCustomSeries,
  LinePrimaryXAxis as LinePrimaryXAxisData,
  LinePrimaryYAxis as LinePrimaryYAxisData,
} from '@/data/dummy';
import { useStateContext } from '@/contexts/ContextProvider';

const LinePrimaryXAxis = {
  ...LinePrimaryXAxisData,
  valueType: 'DateTime' as ValueType,
  edgeLabelPlacement: 'Shift' as EdgeLabelPlacement,
  intervalType: 'Months' as IntervalType,
};

const LinePrimaryYAxis = {
  ...LinePrimaryYAxisData,
  rangePadding: 'None' as ChartRangePadding,
};

const LineChart = () => {
  const { currentMode } = useStateContext();

  return (
    <ChartComponent
      id='line-chart'
      height='420px'
      primaryXAxis={LinePrimaryXAxis}
      primaryYAxis={LinePrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      background={currentMode === 'Dark' ? '#33373e' : '#fff'}
    >
      <Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
      <SeriesCollectionDirective>
        {lineCustomSeries.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default LineChart;
