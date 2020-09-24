import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ViewChild,ElementRef } from '@angular/core'
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

declare var FB: any;

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;
  
  // object of service class and router class
  constructor(private service : ServiceService,private router : Router) { }

  // variables used in google and facebook auth
  auth2:any;
  fbmsg:any;

  // two way binding
  f_name="";
  l_name="";
  email1="";
  pass="";

  email:String;
  password:String;

  onSubmit(){
    const details = {
      email : this.email1,
      password : this.pass
    }
    // send jason data to service.ts file 
    this.service.send(details).subscribe(data=>{
      
      // to navigate to home page
      this.router.navigateByUrl("home");

      // console.log(data);
      },
      (error:HttpErrorResponse) => {
        //ToDo: apply your handling logic e.g.:
        //console.log(errorPayload[0].description)
        alert(error.error.error)
    }
      )

  }

  // GOOGLE API FOR LOGIN 
  googleInitialize() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '615414355424-eneu0gm70a3un7qmr84v9h8qhqs5dakm.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLogin();
      });
    }
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  prepareLogin() {
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
       
       
        this.router.navigateByUrl("home")
      });
  }

  // facebook SDK API FOR LOGIN 

  fbsdk(){
    (window as any).fbAsyncInit = function() {
      FB.init({
        appId      : '777189003115806',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
      FB.AppEvents.logPageView();
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin(){
    console.log("submit login to facebook");
    // FB.login();
    FB.login((response)=>
        {
          // console.log('submitLogin',response);
          // alert('User login sucessfull');
          if (response.authResponse)
          {
            this.router.navigateByUrl("home")
          }
           else
           {
           alert('User login failed');
         }
      });

  }

  ngOnInit(): void {
    this.googleInitialize();
    this.fbsdk();
  }

}
