import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';
import { WebEventService } from '../../services/webevent.service';
import { ToastrService } from 'ngx-toastr';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';  

@Component({
  selector: 'app-company-details',
  standalone: true,  
  imports: [
    CommonModule,
    FormsModule,            
    ReactiveFormsModule,
    FormModule,
    NgMultiSelectDropDownModule  // <-- Must use forRoot()
  ],
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss'] 
})
export class CompanyDetailsComponent implements OnInit {

  businessForm!: FormGroup;
  categories: any[] = [];
 

  selectedCategoriesObjects: any[] = [];  

  // dropdownSettings = {
  //   singleSelection: false,
  //   idField: 'item_id',
  //   textField: 'item_text',
  //   selectAllText: 'Select All',
  //   unSelectAllText: 'UnSelect All',
  //   itemsShowLimit: 3,
  //   allowSearchFilter: true,
  //   enableCheckAll: true
  // };

  dropdownSettings = {
  singleSelection: false,
  idField: 'item_id',
  textField: 'item_text',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 3,
  allowSearchFilter: true,
  enableCheckAll: true
};


  // Convert selected objects to strings
  get selectedCategories(): string[] {
    return this.selectedCategoriesObjects.map(c => c.item_text);
  }

  constructor(
    private fb: FormBuilder,
    private eventService: WebEventService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.businessForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(2)]],
      lname: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
      businessSummary: ['', [Validators.required, Validators.minLength(10)]],
          categories: this.fb.array([], Validators.required), // for checkboxes
            eemaMember: ['', Validators.required]  // new radio button group


      // categories: [[], Validators.required]  // multi-select
    });

    
    setTimeout(() => {
       this.categories = [
  'Corporate',
  'Government',
  'Social',
  'Weddings',
  'Concerts',
  'Expos & Exhibitions'
];
    }, 300);

  }

  get f() {
    return this.businessForm.controls;
  }



// handle checkbox change
onCheckboxChange(event: any) {
  const categoriesArray = this.businessForm.get('categories') as FormArray;

  if (event.target.checked) {
    categoriesArray.push(new FormControl(event.target.value));
  } else {
    const index = categoriesArray.controls.findIndex(x => x.value === event.target.value);
    categoriesArray.removeAt(index);
  }
}


  onSubmit(): void {
    if (this.businessForm.valid) {
      // this.businessForm.patchValue({
      //   categories: this.selectedCategories
      // });

      const formValue = { ...this.businessForm.value };

    // convert array of selected categories into a single string
    formValue.categories = (formValue.categories as string[]).join(', ');

    console.log(formValue);

      this.eventService.registorBusinessDetails(formValue).subscribe(
        response => {
          this.toastr.success('Business registered successfully.', 'Success');
          this.businessForm.reset();
          this.selectedCategoriesObjects = [];
        },
        error => {
          let errorMsg = 'OOPS Something Went Wrong';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          }
          this.toastr.error(errorMsg, 'Error');
        }
      );
    } else {
      alert('Please fill all required fields.');
    }
  }
}
