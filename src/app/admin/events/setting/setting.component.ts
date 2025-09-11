import { Component, OnInit } from '@angular/core';
import { EventService } from '../service/event.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IDropdownSettings, MultiSelectComponent, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccordionButtonDirective, AccordionComponent, AccordionItemComponent, ColComponent, TemplateIdDirective } from '@coreui/angular';
import { freeSet } from '@coreui/icons';
import { IconComponent, IconDirective, IconSetService } from '@coreui/icons-angular';
import { UcfirstPipe } from 'src/app/common/pipe/ucfirst.pipe';


@Component({
  selector: 'app-setting',
  imports: [CommonModule,NgMultiSelectDropDownModule,FormsModule,ColComponent,   IconDirective,
      IconComponent,AccordionComponent,
      AccordionItemComponent,
      TemplateIdDirective,
      AccordionButtonDirective, UcfirstPipe],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent implements OnInit {
  memberType: any[] = [];
  accessType: any[] = [];
  selectedData: any[] = [];
  eventDays: any[] = [];
  eventServices: any[] = [];
  eventId = '';
  dropdownSettings:any = {};
  selectedAccessMap: { [memberId: number]: any[] } = {};
  // deleteIcon = any ;
    // public deleteIcon: any;


  constructor(
      private eventService:EventService,
    private aRoute: ActivatedRoute,
       private toastr: ToastrService,
   
      
    ) {
      this.aRoute.params.subscribe(params => {
        this.eventId = params['id'];
      });

      // this.iconSet.icons = { ...freeSet };
      //   this.deleteIcon = freeSet.cilDelete;
      //   console.log(" this.deleteIcon", this.deleteIcon);

    }

   ngOnInit(): void {
    this.loadMemberAccess();
    this.loadEventAccess();
    this.loadEventDays();
    this.loadEventServices();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      itemsShowLimit: 2,
      allowSearchFilter: true,

    };

    setTimeout(() => {
      this.getAllAccess();
    }, 300);

  }

  loadMemberAccess(){
    this.eventService.getAllEventMemberType(this.eventId)
    .subscribe(
      (data: any) => {
        this.memberType = data.data;
        console.log("member",this.memberType);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

    loadEventDays(){
    this.eventService.getAllEventDays(this.eventId)
    .subscribe(
      (data: any) => {
        this.eventDays = data.data;
        console.log("eventDays",this.eventDays);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadEventAccess()
  {
    this.eventService.getAllEventAccessType(this.eventId)
    .subscribe(
      (data: any) => {
        this.accessType = data.data;
        console.log("accessType",this.accessType);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  loadEventServices(){
    this.eventService.getAllEventServices(this.eventId)
    .subscribe(
      (data: any) => {
        this.eventServices = data.data;
        console.log("eventServices",this.eventServices);
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }




  submitAccess(memberId: number) {

    const selectedAccessId = this.selectedAccessMap[memberId]?.map((access: any) => access.id) || [];

    console.log("selectedAccess",selectedAccessId);
    console.log("memberId",memberId);
    if (!selectedAccessId || selectedAccessId.length === 0) {
      alert("Please select an access type.");
      return;
    }
  
    const payload = {
      eventId: this.eventId,
      memberId: memberId,
      accessId: selectedAccessId
    };

    console.log("payload",payload);
  
    this.eventService.createMemberAccess(payload).subscribe(
      (res: any) => {
        this.toastr.success('Access Provided successfully.', 'Success');

      },
      error => {
        let errorMsg = 'OOPS Something Went Wrong';
        if (error.error && error.error.message) {
          console.log("here", error.error.message);
          errorMsg = error.error.message; // If error response has a message field
        }
        this.toastr.error(errorMsg, 'Error');

      }
    );
  }

  getAllAccess()
  {
    this.eventService.getSelectedAccessList(this.eventId).subscribe(
      (res: any) => {
        // this.toastr.success('Access Provided successfully.', 'Success');
        this.selectedData = res.data;
        console.log("selectedData",this.selectedData);

        this.selectedData.forEach((entry: any) => {
          const memberId = entry.memberId;
          const accessIds: number[] = entry.access;
  
          // Find the full access objects from accessType
          this.selectedAccessMap[memberId] = this.accessType.filter((access: any) =>
            accessIds.includes(access.id)
          );
        });

      },
      error => {
        let errorMsg = 'OOPS Something Went Wrong';
        if (error.error && error.error.message) {
          console.log("here", error.error.message);
          errorMsg = error.error.message; // If error response has a message field
        }
        this.toastr.error(errorMsg, 'Error');

      }
    );
  }

  removeMemberType(memberId: string)
  {
    const confirmResult = confirm('Are you sure you want to remove member type all access of member type will be removed?');
    if (!confirmResult) {
      return; // Do nothing if cancelled
    }

    this.eventService.deleteMemberType(memberId).subscribe(
      (res: any) => {
        this.toastr.success('Meber Type Delete successfully', 'Success');
        this.loadMemberAccess();
      },
      error => {
        let errorMsg = 'OOPS Something Went Wrong';
        if (error.error && error.error.message) {
          console.log("here", error.error.message);
          errorMsg = error.error.message; // If error response has a message field
        }
        this.toastr.error(errorMsg, 'Error');

      }
    );

  }

  removeAccessType(memberId: string)
  {
    const confirmResult = confirm('Are you sure you want to remove Access type?');
    if (!confirmResult) {
      return; // Do nothing if cancelled
    }

    this.eventService.deleteAccessType(memberId).subscribe(
      (res: any) => {
        this.toastr.success('Access Type Delete successfully', 'Success');
        this.loadEventAccess();
        this.getAllAccess();
      },
      error => {
        let errorMsg = 'OOPS Something Went Wrong';
        if (error.error && error.error.message) {
          console.log("here", error.error.message);
          errorMsg = error.error.message; // If error response has a message field
        }
        this.toastr.error(errorMsg, 'Error');

      }
    );

  }

  updateEntryFees(member: any) {
    if (member.entryFees < 0) {
      alert('Entry fees cannot be negative.');
      return;
    }

    if (member.entryFees > 100000) {
      alert('Entry fees cannot greater than 100000.');
      return;
    }
    console.log("member",member);

    const payload = {
      id: member.id,
      entryFees: member.entryFees
    };

    this.eventService.updateEntryFees(payload,this.eventId).subscribe({
      next: () => this.toastr.success('Entry fees updated!'),
      error: () => this.toastr.error('Failed to update entry fees.')
    });
  }
  

  assignDayServiecMemberAccess( dayId:string,serviceId:string )
  {

  const members = this.selectedMembers[dayId]?.[serviceId] || [];

console.log("members",members);
  if (!members) {
    console.log("No members selected for this day");
    return;
  }

const payload = {
    eventId: Number(this.eventId),
    dayId: Number(dayId),
    serviceId: Number(serviceId),
    memberTypeId: members.map(m => m.id)   // ✅ matches backend
  };

  console.log("payload ->", payload);

      this.eventService.assignDayServiceToMember(payload).subscribe(
      (res: any) => {
        this.toastr.success('Day Service Assign to member Successfully.', 'Success');

      },
      error => {
        let errorMsg = 'OOPS Something Went Wrong';
        if (error.error && error.error.message) {
          console.log("here", error.error.message);
          errorMsg = error.error.message; // If error response has a message field
        }
        this.toastr.error(errorMsg, 'Error');

      }
    );

  }


selectedMembers: { [dayId: string]: { [serviceId: string]: any[] } } = {};

private initSelection(dayId: number, serviceId: number) {
  if (!this.selectedMembers[dayId]) this.selectedMembers[dayId] = {};
  if (!this.selectedMembers[dayId][serviceId]) this.selectedMembers[dayId][serviceId] = [];
}

onMemberSelect(member: any, dayId: number, serviceId: number) {
  this.initSelection(dayId, serviceId);
  this.selectedMembers[dayId][serviceId].push(member);
}

onMemberDeSelect(member: any, dayId: number, serviceId: number) {
  this.initSelection(dayId, serviceId);
  this.selectedMembers[dayId][serviceId] =
    this.selectedMembers[dayId][serviceId].filter(m => m.id !== member.id);
}

onSelectAll(members: any[], dayId: number, serviceId: number) {
  this.initSelection(dayId, serviceId);
  this.selectedMembers[dayId][serviceId] = [...members];
}

onDeSelectAll(_: any, dayId: number, serviceId: number) {
  this.initSelection(dayId, serviceId);
  this.selectedMembers[dayId][serviceId] = [];
}


}
