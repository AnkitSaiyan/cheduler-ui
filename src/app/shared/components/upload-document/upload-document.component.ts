import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public refferingNote(event:any){
    console.log(event);
  }
}
