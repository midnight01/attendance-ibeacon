import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
@Injectable()
export class LoginService {

  authState: any = null;
  isLogin: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private db: AngularFireDatabase
  ) { }

  login(user: User){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then((res) => {
        resolve(res);
        this.isLogin = true;
        this.db.object(`isLogin`).set(true);
        this.router.navigate(['/home']);
      })
      .catch((err) => {
        // console.log(err.code);
        if (err.code === 'auth/user-not-found') {
          this.toastr.error('กรุณาลองใหม่อีกครั้ง', 'อีเมลล์ไม่ถูกต้อง !');
        } else if (err.code === 'auth/wrong-password') {
          this.toastr.error('กรุณาลองใหม่อีกครั้ง', 'รหัสผ่านไม่ถูกต้อง !');
        } else {
          this.toastr.error(err);
        }
       });
    });
  }

  logout(){
    this.afAuth.auth.signOut().then(res => {
      this.router.navigate(['/login']);
      this.db.object(`isLogin`).set(false);
      this.isLogin = false;
    });
  }
  getAuth() {
    return this.afAuth.authState.map(auth => auth);
  }
}

export class User{
  email: string;
  password: string;
}
