import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoService } from './todo.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        {
          provide: TodoService,
          useValue: {
            getTasks: () => of([]),
            addTask: () => of({}),
            deleteTask: () => of({}),
            updateTask: () => of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
  });

  it('should get tasks from the service on init', () => {
    const mockTasks = [
      { id: 1, task: 'Task 1' },
      { id: 2, task: 'Task 2' }
    ];

    spyOn(todoService, 'getTasks').and.returnValue(of(mockTasks)); 

    component.ngOnInit(); 

    expect(component.tasks).toEqual(mockTasks);
  });

  it('should add a new task', () => {
    spyOn(todoService, 'addTask').and.callThrough();
    const newTask = 'New Task';

    component.newTask = newTask;
    component.addTask();

    expect(todoService.addTask).toHaveBeenCalledWith(newTask);
  });

  it('should delete a task', () => {
    spyOn(todoService, 'deleteTask').and.callThrough();
    const taskIdToDelete = 1;

    component.deleteTask(taskIdToDelete);

    expect(todoService.deleteTask).toHaveBeenCalledWith(taskIdToDelete);
  });

  it('should update a task', () => {
    spyOn(todoService, 'updateTask').and.callThrough();
    const taskIdToUpdate = 1;
    const updatedTask = 'Updated Task';

    component.updatedTaskValue = updatedTask;
    component.updateTask(taskIdToUpdate);

    expect(todoService.updateTask).toHaveBeenCalledWith(taskIdToUpdate, updatedTask);
  });
});