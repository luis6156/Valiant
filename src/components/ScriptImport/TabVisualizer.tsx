import { useImportScript } from '@/contexts/ImportScriptContext';
import { Icon } from '@iconify/react';
import { ChangeEvent, useEffect, useState } from 'react';
import AttentionText from '../AttentionText';
import { Tab } from './TabsImportScriptVisualizer';

interface Props {
  index: number;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
}

const TabVisualizer = ({ index, setTabs }: Props) => {
  const [numCardsToShow, setNumCardsToShow] = useState(getNumCardsToShow());
  const { scriptColumns, scriptVisualizers, setScriptVisualizers } =
    useImportScript();

  useEffect(() => {
    const handleResize = () => {
      setNumCardsToShow(getNumCardsToShow());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function getNumCardsToShow() {
    if (window.innerWidth < 1150) {
      return 3;
    } else {
      return 5;
    }
  }

  const handleContainerClick = (type: string) => {
    setScriptVisualizers((prev) => {
      const updatedVisualizers = prev.map((visualizer, i) => {
        if (i === index) {
          return { ...visualizer, type };
        } else {
          return visualizer;
        }
      });

      return updatedVisualizers;
    });

    setTabs((prev) => {
      const updatedTabs = prev.map((tab, i) => {
        if (i === index) {
          // map values to names
          if (type === 'line-chart') {
            return { ...tab, title: 'Line Chart' };
          } else if (type === 'bar-chart') {
            return { ...tab, title: 'Bar Chart' };
          } else if (type === 'scatter-chart') {
            return { ...tab, title: 'Scatter Chart' };
          } else if (type === 'pie-chart') {
            return { ...tab, title: 'Pie Chart' };
          } else if (type === 'table') {
            return { ...tab, title: 'Table' };
          } else {
            return tab;
          }
        } else {
          return tab;
        }
      });

      return updatedTabs;
    });
  };

  const handleLabelXChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setScriptVisualizers((prev) => {
      const updatedVisualizers = prev.map((visualizer, i) => {
        if (i === index) {
          return { ...visualizer, labelXColumn: selectedValue };
        } else {
          return visualizer;
        }
      });

      return updatedVisualizers;
    });
  };

  const handleLabelYChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setScriptVisualizers((prev) => {
      const updatedVisualizers = prev.map((visualizer, i) => {
        if (i === index) {
          return { ...visualizer, labelYColumn: selectedValue };
        } else {
          return visualizer;
        }
      });

      return updatedVisualizers;
    });
  };

  const handleLabelZChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;

    setScriptVisualizers((prev) => {
      const updatedVisualizers = prev.map((visualizer, i) => {
        if (i === index) {
          return { ...visualizer, labelZColumn: selectedValue };
        } else {
          return visualizer;
        }
      });

      return updatedVisualizers;
    });
  };

  return (
    <>
      <div className='container px-0'>
        <div className='row justify-content-center'>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={
              scriptColumns.length >= 2
                ? () => handleContainerClick('line-chart')
                : undefined
            }
          >
            <div
              className={`${
                scriptColumns.length < 2
                  ? 'visualizer-container-disabled'
                  : scriptVisualizers[index].type === 'line-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon className='mt-3 visualizer-icon' icon='lucide:line-chart' />
              <span className='mb-3 mt-3 visualizer-text'>Line Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={
              scriptColumns.length >= 2
                ? () => handleContainerClick('bar-chart')
                : undefined
            }
          >
            <div
              className={`${
                scriptColumns.length < 2
                  ? 'visualizer-container-disabled'
                  : scriptVisualizers[index].type === 'bar-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon className='mt-3 visualizer-icon' icon='charm:chart-bar' />
              <span className='mb-3 mt-3 visualizer-text'>Bar Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={
              scriptColumns.length >= 3
                ? () => handleContainerClick('scatter-chart')
                : undefined
            }
          >
            <div
              className={`${
                scriptColumns.length < 3
                  ? 'visualizer-container-disabled'
                  : scriptVisualizers[index].type === 'scatter-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon
                className='mt-3 visualizer-icon'
                icon='icon-park-outline:chart-scatter'
              />
              <span className='mb-3 mt-3 visualizer-text'>Scatter Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={
              scriptColumns.length >= 2
                ? () => handleContainerClick('pie-chart')
                : undefined
            }
          >
            <div
              className={`${
                scriptColumns.length < 2
                  ? 'visualizer-container-disabled'
                  : scriptVisualizers[index].type === 'pie-chart'
                  ? 'visualizer-container active'
                  : 'visualizer-container'
              } d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon
                className='mt-3 visualizer-icon'
                icon='ic:round-pie-chart'
              />
              <span className='mb-3 mt-3 visualizer-text'>Pie Chart</span>
            </div>
          </div>
          <div
            className={`mb-3 col-md-${numCardsToShow >= 5 ? '2' : '4'} ${
              numCardsToShow === 5 ? 'last-col' : ''
            }`}
            onClick={() => handleContainerClick('table')}
          >
            <div
              className={`${
                scriptVisualizers[index].type === 'table' ? 'active' : ''
              } visualizer-container d-flex flex-column align-items-center justify-content-center`}
            >
              <Icon className='mt-3 visualizer-icon' icon='ph:table-fill' />
              <span className='mb-3 mt-3 visualizer-text'>Table</span>
            </div>
          </div>
        </div>
      </div>

      {scriptVisualizers[index].type === 'line-chart' ||
      scriptVisualizers[index].type === 'bar-chart' ||
      scriptVisualizers[index].type === 'scatter-chart' ||
      scriptVisualizers[index].type === 'pie-chart' ? (
        <>
          <div className=''>
            <div className='mb-1'>
              <p className='ps-1'>X Label</p>
            </div>
            <select
              value={
                scriptVisualizers[index]?.labelXColumn
                  ? scriptVisualizers[index]?.labelXColumn
                  : scriptColumns[0]?.name
              }
              className='form-select form-select-special'
              aria-label='default'
              onChange={handleLabelXChange}
            >
              {scriptColumns &&
                scriptColumns.map((column, index) => (
                  <option key={index} value={column.name}>
                    {column.name}
                  </option>
                ))}
              <option value='count'>Count</option>
            </select>
          </div>
          <div className='mt-3'>
            <div className='mb-1'>
              <p className='ps-1'>Y Label</p>
            </div>
            <select
              value={
                scriptVisualizers[index]?.labelYColumn
                  ? scriptVisualizers[index]?.labelYColumn
                  : scriptColumns[1]?.name
              }
              className='form-select form-select-special'
              aria-label='default'
              onChange={handleLabelYChange}
            >
              {scriptColumns &&
                scriptColumns.map((column, index) => (
                  <option key={index} value={column.name}>
                    {column.name}
                  </option>
                ))}
              <option value='count'>Count</option>
            </select>
          </div>
          {scriptVisualizers[index].type === 'scatter-chart' && (
            <div className='mt-3'>
              <div className='mb-1'>
                <p className='ps-1'>Z Label</p>
              </div>
              <select
                value={
                  scriptVisualizers[index]?.labelZColumn
                    ? scriptVisualizers[index]?.labelZColumn
                    : scriptColumns[2]?.name
                }
                className='form-select form-select-special'
                aria-label='default'
                onChange={handleLabelZChange}
              >
                {scriptColumns &&
                  scriptColumns.map((column, index) => (
                    <option key={index} value={column.name}>
                      {column.name}
                    </option>
                  ))}
                <option value='count'>Count</option>
              </select>
            </div>
          )}
        </>
      ) : scriptVisualizers[index].type === 'table' ? (
        <div className=''>
          <AttentionText text='This visualizer does not require any labels as all data will be displayed.' />
        </div>
      ) : null}
      {scriptVisualizers[index].type !== 'table' && (
        <div className='mt-3'>
          <AttentionText text='This visualizer requires at least a numerical column.' />
        </div>
      )}
    </>
  );
};

export default TabVisualizer;
