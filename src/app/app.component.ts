import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ShareService } from './share.service';
import { AgGridAngular } from 'ag-grid-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  ngOnInit(): void {
    this.fetch();
  }
  @ViewChild('agGrid') agGrid: AgGridAngular;
  resultData: any;
  searchdata: any;
  gridOptions: any;
  rowData: any;
  newRowdata: any;
  columnDefs: any[];
  constructor(private service:ShareService){}

  autoGroupColumnDef = {
    headerName: 'Model',
    field: 'model',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
  };
  defaultColDef = {
    sortable: true,
    filter: true,
  };
  public fetch(): void {
    this.service.get1().subscribe(
      (Response: any) => {
        this.resultData = Response;
        this.setRowData(this.resultData);
        this.searchdata = Response;
        console.log(this.resultData);
        this.columnDefs = this.generateColumns(this.resultData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public generateColumns(data: any[]) {
    let columnDefinitions = [];
    data.map((object) => {
      Object.keys(object).map((key) => {
        let mappedColumn = {
          headerName: key.toUpperCase(),
          field: key,
        };
        columnDefinitions.push(mappedColumn);
      });
    });
    columnDefinitions = columnDefinitions.filter(
      (column, index, self) =>
        index ===
        self.findIndex((colAtIndex) => colAtIndex.field === column.field)
    );
    return columnDefinitions;
  }
// search by price
  public filterBasedPrice(e: any): void {
    this.resultData = this.searchdata;
    let array = e.split('-');
    let filtereddata = this.resultData.filter(
      (d: any) => d.price <= array[1] && d.price >= array[0]
    );
    console.log(filtereddata);
    this.resultData = filtereddata;
  }
//serach title
  public searchData(value: any): void {
    if (!value) {
      return (this.resultData = this.searchdata);
    } else {
      let search = this.resultData.filter((item: any) =>
        item.make.toLowerCase().startsWith(value.toLowerCase())
      );
      console.log(search);
      this.resultData = search;
    }
  }
// Export
  public onGridReady(event): void {
    this.gridOptions = event;
  }
  public returnToCSV(): void {
    let params = {
      skipHeader: false,
      skipFooters: true,
      skipGroups: true,
      fileName: 'SampleCSVFile_2kb.csv',
    };
    this.gridOptions.api.exportDataAsCsv(params);
  }

  public setRowData(data): void {
    this.columnDefs = this.generateColumns(data);
    this.rowData = data;
    this.resultData = this.rowData;
  }
// Import
  public modifyExcelSheet(fileInput: any): void {
    let fileReaded = fileInput.target.files[0];
    let reader: FileReader = new FileReader();
    reader.readAsText(fileReaded);
    reader.onload = (e) => {
      let csv: any = reader.result;
      let lines = csv.split('\n');
      let result = [];
      let headers = lines[0].split(',');
      for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
          let headerString = headers[j];
          let dataString = currentline[j];
          obj[headerString] = dataString;
        }
        result.push(obj);
      }
      console.log(result);
      this.setRowData(result);
    };
  }
}