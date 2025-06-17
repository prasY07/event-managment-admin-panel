import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userstatus'
})
export class UserstatusPipe implements PipeTransform {

  transform(status: string): unknown {
     if (!status) return '';
    let badgeClass = '';
    let label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    switch (status.toUpperCase()) {
      case 'INACTIVE':
        badgeClass = 'badge bg-primary';
        break;
      case 'ACTIVE':
        badgeClass = 'badge bg-success';
        break;
      case 'SUSPENDED':
        badgeClass = 'badge bg-danger';
        break;
      default:
        badgeClass = 'badge bg-dark';
        break;
    }

    return `<span class="${badgeClass}">${label}</span>`;
  }

}
