import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiCallsService } from './api-calls.service';
import { environment } from '../environments/environment';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public apiUrl = environment.apiUrl;
  public errorMsg = 'x';
  public apiToken = 'x';
  public retrievedData = [];
  public registrationForm:any;
  public timer:any;

  constructor(private fb:FormBuilder, private _apiCallsService: ApiCallsService){}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(8)]],
      sex: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$') ] ],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')] ],
      continent: ['', Validators.required],
      skills: this.fb.group({
        FullStack: [false],
        JokerEngineer: [false],
        SDLC: [false],
        OpenSource: [false]
      }),
      photo: ['', [Validators.required, Validators.pattern('([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg)$')]],
      photoID: ['']
    });
    this.retrieveEntry();
  //   this.loaderTrigger = true;
  //   this.getPastProcessedMetadata();
  //   this.getCurrentlyProcessingMetadata();
  //   this.getKeysModalValues();
  //   // this.loaderTrigger = false;
  //   this.interval = setInterval(() => {
  //       if(window.location.pathname == "/meta-data-reports"){
  //           this.getCurrentlyProcessingMetadata();
  //       }
  //  }, 5000);
}

  get fullName() {
    return this.registrationForm.get('fullName');
  }
  get sex() {
    return this.registrationForm.get('sex');
  }
  get birthDate() {
    return this.registrationForm.get('birthDate');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get mobile() {
    return this.registrationForm.get('mobile');
  }
  get continent() {
    return this.registrationForm.get('continent');
  }
  get photo() {
    return this.registrationForm.get('photo');
  }
  selectedFile = null;
  newFileName = null;

  formReset(){
    this.registrationForm.reset();
    this.timer = setInterval(() => {
        this.errorMsg = 'x';
   }, 5000);
  }

  onFileSelected(event){
    this.selectedFile = event.target.files[0];
  }

  createEntry() {
    this.newFileName = Math.floor(Math.random() * 9999999999)+".jpg";
    this.registrationForm.patchValue({ photoID: String(this.newFileName) });
    let inputFile = new FormData(); 
    let headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('apiToken', this.apiToken);
    inputFile.append('photo', this.selectedFile, this.newFileName);
      this._apiCallsService.uploadImage(inputFile, headers).
      subscribe(
        response => console.log('Success!', response),
        // error => console.log('Error!', error),
        error => {this.errorMsg = error.statusText;
                  if(this.errorMsg == "OK"){
                    this._apiCallsService.createEntry(this.registrationForm.value, headers).
                    subscribe(
                      response => console.log('Success!', response),
                      // error => console.log('Error!', error)
                      error => {this.errorMsg = error.statusText;
                        if(this.errorMsg == "OK"){
                        this.retrieveEntry();
                        this.formReset();
                        }
                        else{
                          this.errorMsg = error.statusText;
                        }
                      }
                    );
                  }
                  else{
                    this.errorMsg = error.statusText;
                  }
        }
      );
  }

  retrieveEntry(){
    let headers = new Headers();
    headers.append('apiToken', this.apiToken);
    var parameters= "";
    this._apiCallsService.retrieveEntry(parameters, headers).
    subscribe(
      // response => console.log('Success!', response),
      response => this.retrievedData = response,
      // error => console.log('Error!', error)
      error => this.errorMsg = error.statusText,
    );
  }
}
