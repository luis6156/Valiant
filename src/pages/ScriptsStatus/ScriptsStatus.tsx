import Header from '@/components/Header';
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

// import '@syncfusion/ej2-react-grids/styles/bootstrap-dark.css';

const ScriptsStatus = () => {
  const data = [
    {
      executionName: 'Execution 1',
      startTime: '2023-06-16 10:00 AM',
      endTime: '2023-06-16 10:30 AM',
      status: 'Completed',
    },
    {
      executionName: 'Execution 2',
      startTime: '2023-06-16 11:00 AM',
      endTime: '2023-06-16 11:30 AM',
      status: 'Pending',
    },
    // Add more data as needed
  ];

  const columns = [
    { field: 'executionName', headerText: 'Execution Name', width: 150 },
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
