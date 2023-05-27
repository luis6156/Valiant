import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  StackingColumnSeries,
  Tooltip,
  AxisModel,
  ValueType,
  LabelIntersectAction,
} from '@syncfusion/ej2-react-charts';

import {
  stackedCustomSeries,
  stackedPrimaryXAxis as stackedPrimaryXAxisData,
  stackedPrimaryYAxis,
} from '@/data/dummy';

interface Props {
  width: string;
  height: string;
}

const stackedPrimaryXAxis: AxisModel = {
  ...stackedPrimaryXAxisData,
  valueType: 'Category' as ValueType,
  labelIntersectAction: 'Rotate45' as LabelIntersectAction,
};

const Stacked = ({ width, height }: Props) => {
  return (
    <ChartComponent
      width={width}
      height={height}
      id='charts'
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      chartArea={{ border: { width: 0 } }}
      tooltip={{ enable: true }}
      legendSettings={{ background: 'white' }}
    >
      <Inject services={[StackingColumnSeries, Legend, Category, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => (
          <SeriesDirective key={index} {...item} />
        ))}
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

export default Stacked;
