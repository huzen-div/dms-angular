import { Component, OnInit } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MainServiceService } from 'src/app/services/main-service.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IdiskForm,IdiskEdit } from 'src/app/core/models/diskForm.model';
import Swal from 'sweetalert2';

interface IFuturediskForm extends IdiskForm {
  diskId: string;
  type: string;
}

@Component({
  selector: 'app-subfile',
  templateUrl: './subfile.component.html',
  styleUrls: ['./subfile.component.scss']
})

export class SubfileComponent implements OnInit {
  baseApi:string = this.mainServiceService.baseApi;
  masterFileId:string = "";
  subfile:any;
  closeModal: string = "";
  diskForm:IFuturediskForm = {
    name:"",
    description:"",
    diskId:"",
    type:"5"
  }
  constructor(
    private http:HttpClient,
    private route:ActivatedRoute,
    public mainServiceService:MainServiceService,
    private location: Location,
    private modalService: NgbModal
  ) {
    
  }
  ngOnInit(): void {
    this.masterFileId = this.route.snapshot.params['masterFileId'];
    this.getAllDisk()
  }
  getAllDisk(){
    this.http.get<any>(this.baseApi+`/Directory/GetSubFile?masterFileId=${this.masterFileId}`).subscribe(data => {
      this.subfile = data.dataList;
    })
  }
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
  modalSave = () => {
    this.diskForm.diskId = this.masterFileId;
    this.http.post<any>(this.baseApi+'/Directory/CreateDirectory', this.diskForm).subscribe(data => {
      if(data.isSuccess == true){
        this.getAllDisk();
        this.modalService.dismissAll();
      }
    })
  }
  goBack() {
    this.location.back();
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
    this.http.put<any>(this.baseApi+'/Subfile/Edit', this.editForm).subscribe(data => {
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
        this.http.delete<any>(this.baseApi+'/Subfile/Delete?id='+id).subscribe((data) => {
          if(data.isSuccess == true){
            this.getAllDisk();
            this.modalService.dismissAll();
            Swal.fire(
              '??????????????????', 
              '??????????????????????????????????????????', 
              'success'
            );
          }else{
            Swal.fire(
              '???????????????????????????', 
              '???????????????????????????????????????????????????', 
              'error'
            );
          }
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

}
