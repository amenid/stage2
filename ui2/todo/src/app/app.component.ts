import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { environment } from './environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'todo';
  tasks: any[] = [];
  newTask: string = '';
  editingTaskId: number | null = null;
  updatedTaskValue: string = '';

  constructor(private todoService: TodoService) { } 

  ngOnInit() {
    this.getTasks();
      console.log(environment.apiUrl); 

  }

  getTasks() {
    this.todoService.getTasks().subscribe((tasks) => {
      this.tasks = tasks; 
    });
  }

  addTask() {
    this.todoService.addTask(this.newTask).subscribe(() => {
      this.newTask = '';
      this.getTasks(); 
    });
  }

  deleteTask(id: any) { 
    this.todoService.deleteTask(id).subscribe(() => { 
      this.getTasks();
    });
  }

  startEditing(taskId: number, task: string) {
    this.editingTaskId = taskId;
    this.updatedTaskValue = task;
  }

  updateTask(taskId: number) { 
    this.todoService.updateTask(taskId, this.updatedTaskValue) 
    .subscribe(() => {
      this.getTasks();
      this.editingTaskId = null; 
    });
  }

}
