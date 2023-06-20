import Header from '@/components/Header';
import { ScriptStatus } from '@/hooks/useScriptsStatusListener';
import { useState } from 'react';
import ScriptOutput from './ScriptOutput';
import { Icon } from '@iconify/react';

import '../../styles/ScriptsStatus/ScriptsStatus.scss';
import Table from '@/components/Charts/Table';

interface Props {
  data: ScriptStatus[];
}

const ScriptsStatus = ({ data }: Props) => {
  const [scriptIndex, setScriptIndex] = useState<number>(-1);

  const outputTemplate = (startTime: string) => {
    const index = data.findIndex((item) => item.startTime === startTime);
    const rowData = data[index];

    if (
      rowData &&
      rowData.status === 'Completed' &&
      rowData.output &&
      rowData.output.length > 0
    ) {
      return (
        <div
          className='output-container d-flex align-items-center'
          onClick={() => handleScriptOutputClick(index)}
        >
          <Icon className='me-1' icon='material-symbols:open-in-new' />
          <p className='output-text'>View Output</p>
        </div>
      );
    } else if (rowData && rowData.status === 'Running') {
      return <p className='output-text'>-</p>;
    }
    return null;
  };

  const columns = [
    { field: 'executionName', headerText: 'Execution Name', width: 150 },
    { field: 'scriptName', headerText: 'Script Name', width: 150 },
    { field: 'startTime', headerText: 'Start Time', width: 150 },
    { field: 'endTime', headerText: 'End Time', width: 150 },
    { field: 'status', headerText: 'Status', width: 100 },
    {
      headerText: 'Output',
      width: 100,
      template: (props: any) => outputTemplate(props.startTime),
    },
  ];

  const handleScriptOutputClick = (index: number) => {
    setScriptIndex(index);
  };

  const onGoBack = () => {
    setScriptIndex(-1);
  };

  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Scripts Status'
          subtitle='Check the status of your scripts and visualize the results'
        />
      </div>
      {scriptIndex > -1 ? (
        <ScriptOutput
          executionName={data[scriptIndex].executionName}
          scriptName={data[scriptIndex].scriptName}
          output={data[scriptIndex].output}
          outputColumns={data[scriptIndex].outputColumns}
          handleGoBack={onGoBack}
        />
      ) : (
        <div>
          <Table
            data={data}
            columns={columns}
            sortSettings={[{ field: 'startTime', direction: 'Descending' }]}
          />
        </div>
      )}
    </>
  );
};

export default ScriptsStatus;
