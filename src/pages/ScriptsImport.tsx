import Header from '@/components/Header';

import '../styles/scripts_import/scripts_import.scss';
import FloatingLabelInput from '@/components/FloatingLabelInput';
import FloatingLabelTextarea from '@/components/FloatingLabelTextarea';

const ScriptsImport = () => {
  return (
    <>
      <div className='mt-3 mb-3'>
        <Header
          title='Import Scripts'
          subtitle='Import your custom scripts for better vulnerability management'
        />
      </div>
      <div className='container-fluid ms-0 ps-0'>
        <div className='row'>
          <div className='col-md-8'>
            <div className='mb-3'>
              <FloatingLabelInput
                required={true}
                // ref={itemsPerPageRef}
                name='github-page'
                type='text'
                label='Github Page'
                helpText='Provide the path to the Github page where your scripts are located for easier management. The link does not have to be from GitHub, but it must be a valid link.'
                // maxLength={2}
                // defaultValue={numRowsToShow}
              />
            </div>
            <div className='mb-3'>
              <FloatingLabelInput
                required={true}
                // ref={itemsPerPageRef}
                name='script-name'
                type='text'
                label='Script Name'
                // helpText='Provide the path to the Github page where your scripts are located for easier management. The link does not have to be from GitHub, but it must be a valid link.'
                maxLength={20}
                // defaultValue={numRowsToShow}
              />
            </div>
            <div className='mb-3'>
              <FloatingLabelTextarea
                required={true}
                // ref={itemsPerPageRef}
                name='script-desc'
                label='Description'
                maxLength={200}
                isResizable={false}
                // defaultValue={numRowsToShow}
              />
            </div>
          </div>
          <div
            className='col-md-4 script-import-right'
          >
            caca
          </div>
        </div>
      </div>
    </>
  );
};

export default ScriptsImport;
