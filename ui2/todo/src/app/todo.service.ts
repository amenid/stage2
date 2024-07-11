import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  APIURL = 'http://localhost:8000/'; 

  constructor(private http: HttpClient) {}

getTodos(): Observable<any> {
    return this.http.get(this.APIURL);
  }
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.APIURL + 'get_tasks');
  }

  addTask(task: string): Observable<any> { 
    let body = new FormData();
    body.append('task', task);
    return this.http.post(this.APIURL + "add_tasks", body);
  }

  deleteTask(id: any): Observable<any> {
    let body = new FormData();
    body.append('id', id);
    return this.http.post(this.APIURL + "delete_tasks", body);
  }

  updateTask(taskId: number, task: string): Observable<any> {
    const body = new FormData();
    body.append('id', taskId.toString());
    body.append('task', task);
    return this.http.post(this.APIURL + 'update_tasks', body);
  }
}