import { Component, OnInit } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { MainServiceService } from 'src/app/services/main-service.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IdiskForm,IdiskEdit } from 'src/app/core/models/diskForm.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disk',
  templateUrl: './disk.component.html',
  styleUrls: ['./disk.component.scss']
})
export class DiskComponent {

  baseApi:string = this.mainServiceService.baseApi;
  constructor(private http:HttpClient,public mainServiceService:MainServiceService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getAllDisk();
  }
  diskdrive:any;
  getAllDisk(){
    this.http.get<any>(this.baseApi+'/Directory/GetAllDisk',).subscribe(data => {
      this.diskdrive = data.dataList;
      console.log(data)
    })
  }

  closeModal: string = '';
  triggerModal(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  diskForm:IdiskForm = {
    name:"",
    description:""
  }
  
  modalSave = () => {
    this.http.post<any>(this.baseApi+'/Directory/CreateDisk', this.diskForm).subscribe(data => {
      if(data.isSuccess == true){
        this.getAllDisk();
        this.modalService.dismissAll();
      }
    })
  }

  editForm:IdiskEdit = {
    id:0,
    name:"",
    description:""
  }
  editTbl(content:any,tblValue:any) {
    this.editForm.id = tblValue.id;
    this.editForm.name = tblValue.name;
    this.editForm.description = tblValue.description;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  modalEditSave = () => {
    console.log(this.editForm)
    this.http.put<any>(this.baseApi+'/Storages/Edit', this.editForm).subscribe(data => {
      if(data.isSuccess == true){
        this.getAllDisk();
        this.modalService.dismissAll();
      }
    })
  }
  deleteTbl(id:number){
    console.log(id)
    this.mainServiceService.alertConfirmation().then((result) => {
      if (result.value) {
        this.http.delete<any>(this.baseApi+'/Storages/Delete?id='+id).subscribe((data) => {
          if(data.isSuccess == true){
            this.getAllDisk();
            this.modalService.dismissAll();
            Swal.fire(
              'สำเร็จ', 
              'ลบรายการสำเร็จ', 
              'success'
            );
          }else{
            Swal.fire(
              'ไม่สำเร็จ', 
              'ลบรายการไม่สำเร็จ', 
              'error'
            );
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  
}
