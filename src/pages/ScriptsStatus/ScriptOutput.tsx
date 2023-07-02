import BarChart from '@/components/Charts/BarChart';
import LineChart from '@/components/Charts/LineChart';
import Table from '@/components/Charts/Table';
import { ScriptVisualizerFormat } from '@/contexts/ImportScriptContext';
import { Icon } from '@iconify/react';

interface Props {
  executionName: string;
  scriptName: string;
  output: any[];
  outputColumns: { name: string; type: string }[];
  handleGoBack: () => void;
  visualizers: ScriptVisualizerFormat[];
}

const ScriptOutput = ({
  executionName,
  scriptName,
  output,
  outputColumns,
  handleGoBack,
  visualizers,
}: Props) => {
  let processedColumns = outputColumns.map(
    (column: { name: string; type: string }) => {
      return {
        field: column.name,
        headerText: column.name,
        width: 100,
      };
    }
  );

  return (
    <>
      <div className='d-flex align-items-center mb-3'>
        <button
          className='btn btn-info github-arrow d-flex align-items-center me-3'
          onClick={handleGoBack}
        >
          <Icon icon='ic:round-arrow-left' />
        </button>
        <h5 className='script-name m-0'>
          {executionName} ➜ {scriptName}
        </h5>
      </div>
      <div className='mb-3'>
        <Table data={output} columns={processedColumns} showExport={true} />
      </div>
      {visualizers.map((visualizer, index) => {
        if (visualizer.type === 'bar-chart') {
          if (visualizer.labelYColumn === 'count') {
            let counts: number[] = [];

            // Count each value in the column defined as labelXColumn
            output.forEach((row) => {
              counts[row[visualizer.labelXColumn]] =
                (counts[row[visualizer.labelXColumn]] || 0) + 1;
            });

            const transformedCounts = Object.entries(counts).map(
              ([key, value]) => ({
                key,
                value,
              })
            );

            return (
              <div className='mb-3'>
                <BarChart
                  data={transformedCounts}
                  xColumn={visualizer.labelXColumn}
                  yColumn='count'
                />
              </div>
            );
          }
        }
      })}
    </>
  );
};

export default ScriptOutput;
