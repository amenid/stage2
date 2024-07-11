import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo';
  tasks: any[] = [];
  APIURL = "http://localhost:8000/";
  newtask: string = '';
  updateTask: string = '';
  editingTaskId: number | null = null; // Variable to track the task being edited

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.get_tasks();
  }

  get_tasks() {
    this.http.get<any[]>(this.APIURL + "get_tasks").subscribe((res) => {
      this.tasks = res;
    });
  }

  add_tasks() {
    let body = new FormData();
    body.append('task', this.newtask);
    this.http.post(this.APIURL + "add_tasks", body).subscribe((res) => {
      alert(res);
      this.newtask = "";
      this.get_tasks();
    });
  }

  delete_tasks(id: any) {
    let body = new FormData();
    body.append('id', id);
    this.http.post(this.APIURL + "delete_tasks", body).subscribe((res) => {
      alert(res);
      this.get_tasks();
    });
  }

  start_editing(taskId: number, task: string) {
    this.editingTaskId = taskId;
    this.updateTask = task;
  }

  update_task(taskId: number) {
    const body = new FormData();
    body.append('id', taskId.toString());
    body.append('task', this.updateTask);

    this.http.post(this.APIURL + 'update_tasks', body).subscribe((res) => {
      alert(res);
      this.get_tasks();
      this.editingTaskId = null; // Reset after updating
    });
  }
}
