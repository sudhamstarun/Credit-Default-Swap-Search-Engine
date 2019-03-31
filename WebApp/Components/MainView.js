import React from 'react';
import Papa from 'papaparse';
import Navbar from './Navbar';
import DataTable from './DataTable';
import Search from './Search';
import Spinner from 'react-spinner';
import 'react-spinner/react-spinner.css';
import '../styles.css';
import WebpackDate from '../../webpack.date.json';


const propTypes = {

};

export default class MainView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      filteredData: undefined,
      dataSource: '',
      isError: false,
      packdate: WebpackDate.date,
    };
    this.filterData = this.filterData.bind(this);
  }

  componentDidMount() {
    this.import();
  }

  getQueryStringParam(name) {
    let value = null;
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (results) {
      value = decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    return value;
  }

  getExternalFileUrl() {
    return this.getQueryStringParam('externalFileUrl');
  }

  getLocalFileName() {
    let file = this.getQueryStringParam('file');
    if (!file) {
      file = 'default.csv';
    }
    return file;
  }

  import() {
    const localFolder = './csv/';
    const localFileName = this.getLocalFileName();
    let path = localFolder + localFileName;

    const externalFileUrl = this.getExternalFileUrl();
    if (externalFileUrl) {
      path = externalFileUrl;
    }

    this.setState({
      dataSource: path,
    });

    Papa.parse(path, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: results => {
        this.parseCSV(results);
      },
      error: () => {
        this.setState({
          isError: true,
        });
      },
    });
  }

  parseCSV(results) {
    this.setState({
      data: results.data,
      filteredData: results.data,
    });
  }

  export(json) {
    const filename = 'data.csv';
    const csv = Papa.unparse(json);
    const blob = new Blob([csv], { type: 'text/csv' });

    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
    }
    else {
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob, {
        type: 'text/plain',
      });
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  filterData(data) {
    this.setState({
      filteredData: data,
    });
  }

  render() {
    const data = this.state.data;
    const filteredData = this.state.filteredData;
    const dataSource = encodeURI(this.state.dataSource);
    const isError = this.state.isError;
    const packdate = this.state.packdate;

    return (
      <div>
        <Navbar />
        <main className="container">
          {(() => {
            if (isError) {
              return (<div className="row">
                <div className="col-sm-12">
                  <div className="alert alert-danger alert-dismissible" role="alert">
                    <strong>Oh snap!</strong> We had some issues resolving the data
                    source: {dataSource}.
                  </div>
                </div>
              </div>);
            }
            if (!this.state.data) {
              return <div className="row"><Spinner /></div>;
            }
            return (<div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-xs-8 col-sm-4">
                    <Search data={data} onFilteredData={this.filterData} />
                  </div>
                  <div className="col-xs-4 pull-right">
                    <a
                      className="btn btn-primary pull-right"
                      onClick={this.export.bind(this, filteredData)}
                    >Export to CSV</a>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-xs-12">
                    <DataTable limit={20} values={filteredData} />
                  </div>
                </div>
              </div>
            </div>);
          })()}
          <small>Packed: <span>{packdate}</span></small>
        </main>
      </div>
    );
  }
}

MainView.propTypes = propTypes;
