import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private status_text: string = "Nicht angemeldet";
  
  constructor() { }
  
  public setStatusText(new_status_text: string): void {
    this.status_text = new_status_text;
  }
  
  public getStatusText(): string {
    return this.status_text;
  }
}
