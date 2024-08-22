import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

    loginForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController,
     private alertCtrl: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}


   async mostrarAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Usuario o contraseña incorrectos',
      message: 'Por favor ponga los campos correctamente',
      buttons: ['OK']
    });

    await alert.present();
  }


  login() {
    if (this.loginForm.valid) {
      const enteredUsername = this.loginForm.value.username;
      const enteredPassword = this.loginForm.value.password;

      if (enteredUsername === 'Lacuenca12' && enteredPassword === 'diario9898') {
        this.navCtrl.navigateRoot('/home');
      } else {
        this.mostrarAlerta()
      }
    } else {
      this.mostrarAlerta()
    }
  }

}
