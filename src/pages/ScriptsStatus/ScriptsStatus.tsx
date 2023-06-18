import Header from '@/components/Header';
import useScriptsStatusListener, {
  ScriptStatus,
} from '@/hooks/useScriptsStatusListener';
import {
  ColumnDirective,
  ColumnsDirective,
  Edit,
  Filter,
  GridComponent,
  Inject,
  Page,
  Search,
  Sort,
  Toolbar,
} from '@syncfusion/ej2-react-grids';

interface Props {
  data: ScriptStatus[];
}

const ScriptsStatus = ({ data }: Props) => {
  const columns = [
    { field: 'executionName', headerText: 'Execution Name', width: 150 },
    { field: 'scriptName', headerText: 'Script Name', width: 150 },
    { field: 'startTime', headerText: 'Start Time', width: 150 },
    { field: 'endTime', headerText: 'End Time', width: 150 },
    { field: 'status', headerText: 'Status', width: 100 },
  ];

  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Scripts Status'
          subtitle='Check the status of your scripts and visualize the results'
        />
      </div>
      <div>
        <GridComponent
          dataSource={data}
          allowSorting={true}
          allowPaging={true}
          pageSettings={{ pageSize: 10 }}
          toolbar={['Search']}
        >
          <ColumnsDirective>
            {columns.map((column) => (
              <ColumnDirective
                key={column.field}
                field={column.field}
                headerText={column.headerText}
              />
            ))}
          </ColumnsDirective>
          <Inject services={[Sort, Page, Search, Toolbar]} />
        </GridComponent>
      </div>
    </>
  );
};

export default ScriptsStatus;
