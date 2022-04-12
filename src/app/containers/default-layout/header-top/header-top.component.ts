import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss']
})
export class HeaderTopComponent implements OnInit {

  constructor() { }

  userFullName : string = "-";

  ngOnInit(): void {
    // this.setUserProfileItem()
    // localStorage.removeItem("userProfile")
    if (localStorage.getItem("userProfile") !== null) {
      let userProfile = JSON.parse(localStorage.getItem("userProfile") || "");
      this.userFullName = userProfile.namePrefix+" "+userProfile.firstName+" "+userProfile.lastName;
    }else{
      // window.location.href='https://eselfservice-web.demotoday.net';
    }
  }
  setUserProfileItem(){
    let JSONDatas = {
      "id": 1,
      "userName": "1111111111111",
      "password": null,
      "userType": "P",
      "latestVerificationRequestId": 0,
      "isHeritage": 0,
      "isActive": 1,
      "namePrefix": "พระครูปัญญาภรณโสภณ",
      "firstName": "Amarin",
      "lastName": "Chan",
      "companyName": null,
      "companyId": 0,
      "email": "firstamarin7@gmail.com",
      "mobile": "0646655536",
      "insureTypeId": 0,
      "insureTypeCode": null,
      "insureTypeShortName": null,
      "insureTypeFullName": null
    }
    localStorage.setItem("userProfile", JSON.stringify(JSONDatas));
  }

}
