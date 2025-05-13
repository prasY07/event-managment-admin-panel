import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventStatus'
})
export class EventStatusPipe implements PipeTransform {

  transform(status: string): any {
    let badgeClass = '';
    let label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    switch (status.toUpperCase()) {
      case 'UPCOMING':
        badgeClass = 'badge bg-primary';
        break;
      case 'ONGOING':
        badgeClass = 'badge bg-success';
        break;
      case 'ACTIVE':
        badgeClass = 'badge bg-success';
        break;
      case 'COMPLETED':
        badgeClass = 'badge bg-secondary';
        break;
      case 'CANCELLED':
        badgeClass = 'badge bg-danger';
        break;
      case 'INACTIVE':
        badgeClass = 'badge bg-danger';
        break;
      default:
        badgeClass = 'badge bg-dark';
        break;
    }

    return `<span class="${badgeClass}">${label}</span>`;
  }

}
