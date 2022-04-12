import { Component, OnInit } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { MainServiceService } from 'src/app/services/main-service.service';

@Component({
  selector: 'app-treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss']
})

export class TreeviewComponent implements OnInit {

  baseApi:string = this.mainServiceService.baseApi;
  constructor(private http:HttpClient,public mainServiceService:MainServiceService) {}

  ngOnInit(): void {
    this.fileCabinet = this.fileCabinet1;
    this.getAllDisk();
  }
  diskdrive:any;
  getAllDisk(){
    this.http.get<any>(this.baseApi+'/Directory/GetAllDisk',).subscribe(data => {
      this.diskdrive = data.dataList;
      console.log(data)
    })
  }
  
  fileCabinet:any;
  fileCabinet1 : any[] =[
    {
      id:1,
      name:"COCS ตู้เอกสาร",
      description:"COCS ตู้เอกสาร",
      type:"ตู้เอกสาร",
      drawer:[
        {
          id:1,
          name:"COCS ลิ้นชัก",
          description:"",
          type:"ลิ้นชัก",
          mainFile:[
            {
              id:1,
              name:"COCS แฟ้มหลัก1",
              description:"",
              type:"แฟ้มหลัก",
              subFile:[
                {
                  id:1,
                  name:"COCS แฟ้มย่อย1",
                  description:"",
                  type:"แฟ้มย่อย",
                },
                {
                  id:2,
                  name:"COCS แฟ้มย่อย2",
                  description:"",
                  type:"แฟ้มย่อย",
                },
                {
                  id:3,
                  name:"COCS แฟ้มย่อย3",
                  description:"",
                  type:"แฟ้มย่อย",
                }
              ]
            },
            {
              id:2,
              name:"COCS แฟ้มหลัก2",
              description:"",
              type:"แฟ้มหลัก",
              subFile:[
                {
                  id:1,
                  name:"COCS แฟ้มย่อย",
                  description:"",
                  type:"แฟ้มย่อย",
                }
              ]
            }
          ]
        }
      ]
    }
  ]

  onOptionsDiskdriveSelected(event:any){
    // var value = event.target.value;
    // console.log(value);
    let selectedId:number = event.target["selectedIndex"];
    console.log(selectedId)
    console.log(event.target.options[selectedId].getAttribute("diskdrive_name"))
    if(selectedId == 1){
      this.fileCabinet = this.fileCabinet1;
    }else{
      this.http.get<any>(this.baseApi+'/Directory/getDirectory?id=1',).subscribe(data => {
          this.fileCabinet = data.dataList;
          console.log(data)
      })
    }
  }
  rowCabinetClick(fileCabinetId:number){
    console.log(fileCabinetId)
  }
}
