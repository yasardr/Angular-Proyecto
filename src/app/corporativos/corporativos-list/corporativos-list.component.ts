import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatatableComponent, ColumnMode } from '@swimlane/ngx-datatable';
import { CorporativosService } from '../services/corporativos.service';
import { Corporativo } from '../models/corporativo.model';


@Component({
  selector: 'app-corporativos-list',
  templateUrl: './corporativos-list.component.html',
  styleUrls: [
    './corporativos-list.component.scss',
    '../../../assets/sass/libs/datatables.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CorporativosListComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // row data
  public rows = [];
  public ColumnMode = ColumnMode;
  public limitRef = 10;

  // column header
  public columns = [
    { name: 'CORPORATIVO', prop: 'NombreCorto' },
    { name: 'URL', prop: 'Url' },
    { name: 'INCORPORACIÓN', prop: 'FechaIncorporacion' },
    { name: 'CREADO EL', prop: 'FechaCreacion' },
    { name: 'ASIGANDO A', prop: 'UsrAsignado' },
    { name: 'STATUS', prop: 'Status' },
    { name: 'ACCIONES', prop: '' },
  ];

  // private
  private tempData = [];

  constructor( private corporativosService: CorporativosService ) {
    this.corporativosService.getCorporativos()
        .subscribe((usersListData: Corporativo[]) => {
          this.tempData = usersListData;
          this.rows = usersListData;
        });
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * filterUpdate
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.tempData.filter(function (d) {
      return d.Username.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  /**
   * updateLimit
   *
   * @param limit
   */
  updateLimit(limit) {
    this.limitRef = limit.target.value;
  }

  ngOnInit(): void {}
}
