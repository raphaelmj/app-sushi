import { Injectable } from '@angular/core';
import { alert, confirm } from "tns-core-modules/ui/dialogs"

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }


  showAlert(message: string) {
    let options = {
      title: message,
      message: '',
      okButtonText: "OK"
    };

    alert(options)
  }


  confirmMake(title: string, message: string = ""): Promise<boolean> {
    let options = {
      title: title,
      message: message,
      okButtonText: "Tak",
      cancelButtonText: "Nie",
      neutralButtonText: "Anuluj"
    };

    return confirm(options)
  }

}
