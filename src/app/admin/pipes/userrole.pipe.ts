import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userrole'
})
export class UserrolePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
