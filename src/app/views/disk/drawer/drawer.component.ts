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
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit {
  baseApi:string = this.mainServiceService.baseApi;
  cabinetId:string = "";
  drawer:any;
  closeModal: string = "";
  diskForm:IFuturediskForm = {
    name:"",
    description:"",
    diskId:"",
    type:"3"
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
    this.cabinetId = this.route.snapshot.params['cabinetId'];
    this.getAllDisk()
  }
  getAllDisk(){
    this.http.get<any>(this.baseApi+`/Directory/GetDrawer?cabinetId=${this.cabinetId}`).subscribe(data => {
      this.drawer = data.dataList;
      console.log(data)
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
    this.diskForm.diskId = this.cabinetId;
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
    this.http.put<any>(this.baseApi+'/Drawer/Edit', this.editForm).subscribe(data => {
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
        this.http.delete<any>(this.baseApi+'/Drawer/Delete?id='+id).subscribe((data) => {
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
