import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Util } from 'src/app/shared/utills/utils';
import { EnumColumn } from '../models/enum-column';

@Component({
  selector: 'app-column-enum',
  templateUrl: './column-enum.component.html',
})
export class ColumnEnumComponent implements OnInit{
   @Input() column:EnumColumn;
   @Input() entity:any;
   constructor(){

   }
  ngOnInit(): void {
    
  }

  getCellValue(){
    return this.column._enumOptions.pipe(map(enumOptions=>{
      const result = Util.getter(this.entity,this.column.field);
      const options = enumOptions.options.find(c=>c[enumOptions.value]===result);
      if(!Util.isUndefinedOrNullOrWhiteSpace(options)){
        return options[enumOptions.text];
      }else{
        return Util.isUndefinedOrNullOrWhiteSpace(result)?'':result;
      }
    }))
  }
}
