import BarChart from '@/components/Charts/BarChart';
import LineChart from '@/components/Charts/LineChart';
import Table from '@/components/Charts/Table';
import { Icon } from '@iconify/react';

interface Props {
  executionName: string;
  scriptName: string;
  output: any[];
  outputColumns: { name: string; type: string }[];
  handleGoBack: () => void;
}

const ScriptOutput = ({
  executionName,
  scriptName,
  output,
  outputColumns,
  handleGoBack,
}: Props) => {
  console.log(output);
  console.log(outputColumns);

  const processedColumns = outputColumns.map(
    (column: { name: string; type: string }) => {
      return {
        field: column.name,
        headerText: column.name,
        width: 100,
      };
    }
  );

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
        <Table data={output} columns={processedColumns} />
      </div>
      <div className='mb-3'>
        <LineChart
          data={linechart}
          xColumn='x'
          yColumn='y'
          // yColumns={[
          //   'Search',
          //   'First Name',
          //   'Last Name',
          //   'Title',
          //   'URL',
          //   'Raw Text',
          // ]}
        />
      </div>
      <div className='mb-3'>
        <BarChart
          data={output}
          xColumn='URL'
          yColumn='Search'
          // yColumns={[
          //   'Search',
          //   'First Name',
          //   'Last Name',
          //   'Title',
          //   'URL',
          //   'Raw Text',
          // ]}
        />
      </div>
    </>
  );
};

export default ScriptOutput;
