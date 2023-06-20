import {
  ColumnChooser,
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Inject,
  Page,
  Search,
  Sort,
  Toolbar,
} from '@syncfusion/ej2-react-grids';

interface ColumnDefinition {
  field?: string;
  headerText: string;
  width: number;
  template?: any;
}

interface SortDescriptor {
  field: string;
  direction?: 'Ascending' | 'Descending';
}

interface Props {
  data: any[];
  columns: ColumnDefinition[];
  sortSettings?: SortDescriptor[];
}

const Table = ({ data, columns, sortSettings }: Props) => {
  return (
    <GridComponent
      dataSource={data}
      allowSorting={true}
      allowPaging={true}
      pageSettings={{ pageSize: 10 }}
      showColumnChooser={true}
      toolbar={['Search', 'ColumnChooser']}
      sortSettings={{ columns: sortSettings }}
    >
      <ColumnsDirective>
        {columns.map((column, index) => (
          <ColumnDirective
            key={index}
            field={column.field}
            headerText={column.headerText}
            template={column.template}
          />
        ))}
      </ColumnsDirective>
      <Inject services={[Sort, Page, Search, Toolbar, ColumnChooser]} />
    </GridComponent>
  );
};

export default Table;
