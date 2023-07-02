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
  PdfExport,
  ExcelExport,
  Grid,
  ToolbarItems,
  Resize,
  Edit,
  EditSettingsModel,
} from '@syncfusion/ej2-react-grids';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

interface ColumnDefinition {
  field?: string;
  headerText: string;
  width?: number;
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
  showExport?: boolean;
}

const Table = ({ data, columns, sortSettings, showExport = false }: Props) => {
  let grid: Grid | null;
  let toolbar = ['Search', 'ColumnChooser'] as ToolbarItems[];

  if (showExport) {
    toolbar.push('PdfExport');
    toolbar.push('ExcelExport');
  }

  const toolbarClick = (args: ClickEventArgs) => {
    if (grid && args.item.id === 'grid_pdfexport') {
      grid.pdfExport();
    } else if (grid && args.item.id === 'grid_excelexport') {
      grid.excelExport();
    }
  };

  const editOptions: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
  };

  return (
    <div>
      <GridComponent
        id='grid'
        dataSource={data}
        allowSorting={true}
        allowPaging={true}
        allowPdfExport={true}
        allowExcelExport={true}
        allowResizing={true}
        pageSettings={{ pageSize: 10 }}
        showColumnChooser={true}
        toolbar={toolbar}
        sortSettings={{ columns: sortSettings }}
        toolbarClick={toolbarClick}
        ref={(g) => (grid = g)}
        editSettings={editOptions}
      >
        <ColumnsDirective>
          {columns.map((column, index) => (
            <ColumnDirective
              key={index}
              field={column.field}
              headerText={column.headerText}
              template={column.template}
              width={column.width}
              minWidth={100}
              allowResizing={true}
            />
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Sort,
            Page,
            Search,
            Toolbar,
            ColumnChooser,
            PdfExport,
            ExcelExport,
            Resize,
            Edit,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default Table;
