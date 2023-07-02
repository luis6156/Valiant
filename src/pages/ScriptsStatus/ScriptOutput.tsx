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
  // console.log(output);
  // console.log(outputColumns);

  let processedColumns = outputColumns.map(
    (column: { name: string; type: string }) => {
      return {
        field: column.name,
        headerText: column.name,
        width: 100,
      };
    }
  );

  // processedColumns = [
  //   {
  //     field: 'email',
  //     headerText: 'Email',
  //     width: 100,
  //   },
  //   {
  //     field: 'facebook',
  //     headerText: 'Facebook',
  //     width: 100,
  //   },
  //   {
  //     field: 'twitter',
  //     headerText: 'Twitter',
  //     width: 100,
  //   },
  //   {
  //     field: 'snapchat',
  //     headerText: 'Snapchat',
  //     width: 100,
  //   },
  //   {
  //     field: 'rumble',
  //     headerText: 'Rumble',
  //     width: 100,
  //   },
  //   {
  //     field: 'mewe',
  //     headerText: 'MeWe',
  //     width: 100,
  //   },
  //   {
  //     field: 'imgur',
  //     headerText: 'Imgur',
  //     width: 100,
  //   },
  //   {
  //     field: 'adobe',
  //     headerText: 'Adobe',
  //     width: 100,
  //   },
  //   {
  //     field: 'wordpress',
  //     headerText: 'Wordpress',
  //     width: 100,
  //   },
  //   {
  //     field: 'duolingo',
  //     headerText: 'Duolingo',
  //     width: 100,
  //   },
  //   {
  //     field: 'hulu',
  //     headerText: 'Hulu',
  //     width: 100,
  //   },
  //   {
  //     field: 'rubmaps',
  //     headerText: 'Rubmaps',
  //     width: 100,
  //   },
  //   {
  //     field: 'github',
  //     headerText: 'GitHub',
  //     width: 100,
  //   },
  //   {
  //     field: 'gravatar',
  //     headerText: 'Gravatar',
  //     width: 100,
  //   },
  // ];

  // output = [
  //   { email: 'miculuis1@gmail.com', facebook: true, 
  //     twitter: true,
  //   snapchat: true,
  //   rumble: false,
  //   mewe: false ,
  //   imgur: true ,
  //   adobe: true ,
  //   wordpress: false ,
  //   duolingo: true ,
  //   hulu: false ,
  //   rubmaps: false ,
  //   github: true ,
  //   gravatar: false ,
  //   }
  // ];

  // processedColumns = [
  //   {
  //     field: 'user',
  //     headerText: 'User',
  //     width: 100,
  //   },
  //   {
  //     field: 'firefox',
  //     headerText: 'Firefox',
  //     width: 100,
  //   },
  //   {
  //     field: 'gitHub',
  //     headerText: 'GitHub',
  //     width: 100,
  //   },
  //   {
  //     field: 'pinterest',
  //     headerText: 'Pinterest',
  //     width: 100,
  //   },
  //   {
  //     field: 'tumblr',
  //     headerText: 'Tumblr',
  //     width: 100,
  //   },
  //   {
  //     field: 'twitter',
  //     headerText: 'Twitter',
  //     width: 100,
  //   },
  //   {
  //     field: 'instagram',
  //     headerText: 'Instagram',
  //     width: 100,
  //   },
  //   {
  //     field: 'lastfm',
  //     headerText: 'LastFM',
  //     width: 100,
  //   },
  // ];

  // output = [
  //   {
  //     user: 'miculuis1',
  //     firefox: true,
  //     gitHub: true,
  //     pinterest: false,
  //     tumblr: true,
  //     twitter: true,
  //     instagram: true,
  //     lastfm: false,
  //   },
  // ];


  // output.forEach((item) => {
  //   // format should be {f}{last name}@adobe.com
  //   item.email =
  //     item['First Name'].toLowerCase().charAt(0) +
  //     item['Last Name'].toLowerCase() +
  //     '@adobe.com';
  // });

  // processedColumns = [
  //   {
  //     field: 'emails',
  //     headerText: 'Emails',
  //     width: 100,
  //   },
  //   {
  //     field: 'urls',
  //     headerText: 'URLs',
  //     width: 100,
  //   },
  // ];

  // output = [
  //   {
  //     emails: 'apopescu@gmail.com',
  //     urls: 'hxxps://www[.]instagram[.]com/upb1818/',
  //   },
  //   {
  //     emails: 'miculuis1@gmail.com',
  //     urls: 'hxxps://upb[.]ro/consiliul-de-administratie/',
  //   },
  //   {
  //     emails: 'andreib21@gmail.com',
  //     urls: 'hxxps://upb[.]ro/cantine/',
  //   },
  //   {
  //     emails: 'florinmih99@gmail.com',
  //     urls: 'hxxps://upb[.]ro/camine/',
  //   },
  //   {
  //     emails: 'anamariacos1@gmail.com',
  //     urls: 'hxxps://upb[.]ro/wp-content/uploads/2022/01/fils[.]jpg',
  //   },
  //   {
  //     emails: 'elenabulgaru2@gmail.com',
  //     urls: 'hxxps://upb[.]ro/achizitii-publice/',
  //   },
  //   {
  //     emails: 'moldoveanucristian@gmail.com',
  //     urls: 'hxxps://upb[.]ro/facultati/facultatea-de-inginerie-medicala/',
  //   },
  //   {
  //     emails: 'mariaiani00@gmail.com',
  //     urls: 'hxxps://upb[.]ro/conversie-profesionala/',
  //   },
  //   {
  //     emails: 'cosminselesan2@gmail.com',
  //     urls: 'hxxps://posturivacante[.]upb[.]ro/',
  //   },
  //   {
  //     emails: 'floricamadalin987@gmail.com',
  //     urls: 'hxxps://upb[.]ro/excelenta-in-resursa-umana-de-cercetare/',
  //   },
  //   {
  //     emails: 'mariaiani00@gmail.com',
  //     urls: 'hxxps://upb[.]ro/conversie-profesionala/',
  //   },
  // ];

  // processedColumns = [
  //   {
  //     field: 'certificate',
  //     headerText: 'Certificate Information',
  //     width: 100,
  //   },
  //   {
  //     field: 'dns',
  //     headerText: 'DNS Record',
  //     width: 100,
  //   },
  //   {
  //     field: 'whois',
  //     headerText: 'Whois Information',
  //     width: 100,
  //   },
  //   {
  //     field: 'internal_links',
  //     headerText: 'Internal Links',
  //     width: 100,
  //   },
  //   {
  //     field: 'external_links',
  //     headerText: 'External Links',
  //     width: 100,
  //   },
  //   {
  //     field: 'document',
  //     headerText: 'Documents',
  //     width: 100,
  //   }
  // ];

  // output = [
  //   {
  //     certificate: ` Certificate Cipher: ('ECDHE-RSA-CHACHA20-POLY1305', 'TLSv1.2', 256)
  //     Certificate Protocol: TLSv1.2
  //     Certificate Expiration Date: Aug  8 16:45:24 2023 GMT`,
  //     dns: `The DNS response does not contain an answer to the question: upb.ro. IN AAAA`,
  //     whois: `{'domain_name': 'upb.ro', 'status': 'OK', 'registrar': 'ICI - Registrar', 'referral_url': 'http://www.rotld.ro',
  //     'creation_date': datetime.datetime(1994, 8, 7, 0, 0), 'expiration_date': datetime.datetime(2028, 9, 4, 0, 0),
  //     'name_servers': ['pub.pub.ro', 'pub2.pub.ro'], 'dnssec': 'Inactive'}`,
  //     external_links: 'http://antreprenoriat.upb.ro/fii-antreprenor-7-0/?fbclid=IwAR29nVchRBChHqIZidGHk_lTrNztR0FjhhqM-nM9bfvWAisn4EL-lbEvMss',
  //     internal_links: 'https://upb.ro/achizitii-publice/',
  //     document: 'http://atee.upb.ro/atee2017/ATEE_2017_template_en_blind.doc'
  //   },
  //   {
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://community.eelisa.eu/activities/2023-student-unmanned-systems-eelisa-competition/',
  //     internal_links: 'https://upb.ro/evenimente-upb/',
  //     document: 'https://upb.ro/wp-content/uploads/2020/03/Bogatu-Lucian_CV.pdf',
  //   },
  //   {
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'http://antreprenoriat.upb.ro',
  //     internal_links: 'https://upb.ro/?method=ical&',
  //     document: 'https://www.scientificbulletin.upb.ro/rev_docs_arhiva/fulld9b_425565.pdf',
  //   },
  //   {
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://www.kaat.upb.ro/',
  //     internal_links: 'https://upb.ro/wp-sitemap-posts-mec-events-1.xml',
  //     document: 'https://www.scientificbulletin.upb.ro/rev_docs_arhiva/full6151.pdf',
  //   },
  //   {
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://international.upb.ro/',
  //     internal_links: 'https://upb.ro/alumni/mailto:alumni@upb.ro',
  //     document: 'https://www.scientificbulletin.upb.ro/rev_docs_arhiva/full48f_892207.pdf',
  //   },{
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://www.scientificbulletin.upb.ro/index.php',
  //     internal_links: 'https://upb.ro/tag/elissa/',
  //     document: 'https://www.scientificbulletin.upb.ro/rev_docs_arhiva/fullbc5_384749.pdf',
  //   },{
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'http://www.unesco.chair.upb.ro',
  //     internal_links: 'https://upb.ro/2023/05/24/',
  //     document: 'https://solacolu.chim.upb.ro/pg122-133.pdf',
  //   },{
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://autofest.upb.ro/',
  //     internal_links: 'https://upb.ro/2023/05/26/',
  //     document: 'https://solacolu.chim.upb.ro/pg119-128.pdf',
  //   },{
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://spacefest.upb.ro/',
  //     internal_links: 'https://upb.ro/catedra-unesco/',
  //     document: 'https://www.scientificbulletin.upb.ro/rev_docs_arhiva/full6151.pdf',
  //   },{
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://www.facebook.com/POLIJobs.UPB/',
  //     internal_links: 'https://upb.ro/wp-sitemap-taxonomies-post_format-1.xml',
  //     document: 'https://my.upb.ro/tutorials/Ghid_accesare_resurse_gratuite_Microsoft_f%C4%83r%C4%83_Office.pdf',
  //   },{
  //     certificate: '',
  //     dns: '',
  //     whois: '',
  //     external_links: 'https://attend.ieee.org/isc2-2023/',
  //     internal_links: 'https://upb.ro/calendar-evenimente/poli-spacefest/?occurrence=2023-06-11',
  //     document: 'https://solacolu.chim.upb.ro/pg25-35web.pdf',
  //   },
  // ];

  // const linechart = [
  //   {
  //     x: '2021-08-01',
  //     y: 1,
  //   },
  //   {
  //     x: '2021-08-02',
  //     y: 2,
  //   },
  //   {
  //     x: '2021-08-03',
  //     y: 3,
  //   },
  //   {
  //     x: '2021-08-04',
  //     y: 4,
  //   },
  // ];

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
      {/* <div className='mb-3'>
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
      </div> */}
      {/* <div className='mb-3'>
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
      </div> */}
    </>
  );
};

export default ScriptOutput;
