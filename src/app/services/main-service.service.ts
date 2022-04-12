import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from  "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MainServiceService {
  baseApi:string = "https://localhost:44328/api/v1/DMS";
  constructor(private http:HttpClient) {

  }

  alertConfirmation() {
    return Swal.fire({
      title: 'คุณแน่ใจหรือว่าต้องการลบรายการนี้?',
      // text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    });
  }
  
  getDocumentGroup(){
    return this.http.get<any>(this.baseApi+`/DocumentGroup/GetDocument`);
  }
}
