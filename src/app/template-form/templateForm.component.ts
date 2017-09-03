import {Component, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {YoutubeTask} from "../shared/YoutubeTask";

@Component({
  moduleId: module.id,
  selector: 'template-form',
  templateUrl: 'templateForm.component.html',
  styleUrls: ['templateForm.component.scss']
})
export class TemplateFormComponent {

  taskCtrl: FormControl;
  filteredYoutubeTasks: Observable<YoutubeTask[]>;

  title = 'app';
  // mainTaskId: string;
  countVideo: number;
  countReklama: number;
  countMove: number;
  theHtmlString: string;


  listYoutubeTasks: YoutubeTask[] = [
    {
      taskId: '1',
      countOfVideo: 1,
      countOfReklama: 1,
      countOfMove: 1
    },
    {
      taskId: '2',
      countOfVideo: 2,
      countOfReklama: 2,
      countOfMove: 2
    }
  ];


  constructor() {
    this.taskCtrl = new FormControl();

    this.taskCtrl.valueChanges.subscribe(state => {
      if (this.filterTasks(state).length == 1) {
        var selectedTask = this.filterTasks(state)[0];

        this.countVideo = selectedTask.countOfVideo;
        this.countReklama = selectedTask.countOfReklama;
        this.countMove = selectedTask.countOfMove;
      }
    });

    this.filteredYoutubeTasks = this.taskCtrl.valueChanges
      .startWith(null)
      .map(taskId => taskId ? this.filterTasks(taskId) : this.listYoutubeTasks.slice());
  }

  filterTasks(taskId: string) {

    return this.listYoutubeTasks.filter(task =>
    task.taskId.toLowerCase().indexOf(taskId.toLowerCase()) === 0);
  }

  clear() {
    // this.mainTaskId = '';
    this.countVideo = null;
    this.countReklama = null;
    this.countMove = null;

    this.theHtmlString = 'Лето в стране настало,<br>Вереск опять цветет.<br>Но некому готовить<br>Вересковый мед.';
  }

}
