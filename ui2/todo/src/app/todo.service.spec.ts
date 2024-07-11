import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TodoService } from './todo.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms'; // Importer FormsModule

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule], // Ajouter FormsModule
      declarations: [AppComponent],
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

    component.newtask = newTask; // Assurez-vous que le nom est correct
    component.add_tasks(); // Assurez-vous que le nom est correct

    expect(todoService.addTask).toHaveBeenCalledWith(newTask);
  });

  it('should delete a task', () => {
    spyOn(todoService, 'deleteTask').and.callThrough();
    const taskIdToDelete = 1;

    component.delete_tasks(taskIdToDelete); // Assurez-vous que le nom est correct

    expect(todoService.deleteTask).toHaveBeenCalledWith(taskIdToDelete);
  });

  it('should update a task', () => {
    spyOn(todoService, 'updateTask').and.callThrough();
    const taskIdToUpdate = 1;
    const updatedTask = 'Updated Task';

    component.updated_task_value = updatedTask; // Assurez-vous que le nom est correct
    component.update_task(taskIdToUpdate); // Assurez-vous que le nom est correct

    expect(todoService.updateTask).toHaveBeenCalledWith(taskIdToUpdate, updatedTask);
  });
});
