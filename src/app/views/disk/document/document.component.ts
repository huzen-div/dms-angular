import { Component, OnInit } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MainServiceService } from 'src/app/services/main-service.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IDocumentForm } from 'src/app/core/models/diskForm.model';
import Swal from 'sweetalert2';

interface IFutureDocumentForm extends IDocumentForm {
  diskId: string;
}

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  baseApi:string = this.mainServiceService.baseApi;
  subFileId:string = "";
  document:any;
  closeModal: string = "";
  documentForm:IFutureDocumentForm = {
    documentName:"",
    documentCode:"",
    documentGroup:"",
    diskId:""
  }
  documentGroup:any;
  selectedDocumentGroup: string = "";
  selectedDocumentGroupEdit: string = "";
  documentGroupName:string = "";
  fileList!:FileList;
  constructor(
    private http:HttpClient,
    private route:ActivatedRoute,
    public mainServiceService:MainServiceService,
    private location: Location,
    private modalService: NgbModal
  ) {
    
  }
  ngOnInit(): void {
    console.log(this.subFileId)
    this.subFileId = this.route.snapshot.params['subFileId'];
    this.getAllDisk()
    this.getDocumentGroup()
  }
  getAllDisk(){
    this.http.get<any>(this.baseApi+`/Document/GetDocument?subFileId=${this.subFileId}`).subscribe(data => {
      this.document = data.dataList;
    })
  }
  triggerModal(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
    
    // this.getDocumentGroup()
  }
  getDocumentGroup(){
    this.mainServiceService.getDocumentGroup().subscribe(data => {
      if(data.dataList != null){
        this.documentGroup = data.dataList;
      }
    });
  };
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
    this.documentForm.diskId = this.subFileId;
    this.documentForm.documentGroup = this.selectedDocumentGroup;
    this.http.post<any>(this.baseApi+'/Document/CreateDocument', this.documentForm).subscribe(data => {
      if(data.isSuccess == true){
        let {subDirectory,insertId} = data.data;
        this.uploadFile(subDirectory,insertId);
      }
    })
  }
  goBack() {
    this.location.back();
  }

  documentEditForm:IFutureDocumentForm = {
    documentName:"",
    documentCode:"",
    documentGroup:"",
    diskId:""
  }
  openModalEdit(content:any,tblValue:any) {
    this.documentEditForm.documentName = tblValue.documentname;
    this.documentEditForm.documentCode = tblValue.documentcode;
    this.selectedDocumentGroupEdit = tblValue.documentgroup;
    this.documentEditForm.diskId = tblValue.id;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  modalEditSave = () => {
    var requestData = {
      id:this.documentEditForm.diskId,
      documentName:this.documentEditForm.documentName,
      documentCode:this.documentEditForm.documentCode,
      documentGroup:this.selectedDocumentGroupEdit
    };

    this.http.put<any>(this.baseApi+'/Document/UpdateDocument', requestData).subscribe(data => {
      if(data.isSuccess == true){
        this.modalService.dismissAll();
        this.getAllDisk();
      }
    })
  }
  deleteTbl(id:number){
    this.mainServiceService.alertConfirmation().then((result) => {
      if (result.value) {
        this.http.delete<any>(this.baseApi+'/Document/Delete?id='+id).subscribe((data) => {
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

  
  saveGroup = () => {
    this.http.post<any>(this.baseApi+`/DocumentGroup/create?groupName=${this.documentGroupName}`,{}).subscribe(data => {
      if(data.isSuccess == true){
        this.modalService.dismissAll();
      }
    })
  }
  fileChange(event:any) {
    this.fileList = event.target.files;
  }
  uploadFile(subDirectory:string,insertId:string) {
    if(this.fileList.length > 0) {

      const dataObj = {key: "v"};
      const dataJson = JSON.stringify(dataObj);
      const dataBlob = new Blob([dataJson], {type: 'application/json'});

      let file: File = this.fileList[0];
      let formData:FormData = new FormData();
      formData.append('Files', file, file.name);
      formData.append('Content-Type', 'multipart/form-data');
      formData.append("subDirectory", dataBlob, subDirectory);
      formData.append("insertId", dataBlob, insertId);

      this.http.post<any>(this.baseApi+`/Document/uploadFile`,formData).subscribe(data => {
        if(data.isSuccess == true){
          this.modalService.dismissAll();
          this.getAllDisk();
          this.clearInput();
        }
      })
    }
  }
  clearInput(){
    this.documentForm = {
      documentName:"",
      documentCode:"",
      documentGroup:"",
      diskId:""
    }
  }

}
