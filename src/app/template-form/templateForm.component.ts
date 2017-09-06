import {Component, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import {YoutubeTask} from "../shared/YoutubeTask";
import {DataService} from "../shared/DataService";

@Component({
  moduleId: module.id,
  selector: 'template-form',
  templateUrl: 'templateForm.component.html',
  styleUrls: ['templateForm.component.scss'],
  providers: [DataService]
})
export class TemplateFormComponent {

  taskCtrl: FormControl;
  filteredYoutubeTasks: Observable<YoutubeTask[]>;

  getData: string;
  postData: string;

  title = 'app';
  // mainTaskId: string;
  countVideo: string;
  countReklama: string;
  countMove: string;
  theHtmlString: string;


  listYoutubeTasks: YoutubeTask[] = [
    new YoutubeTask("1"),
    new YoutubeTask("2"),
    new YoutubeTask("3")
  ];


  constructor(private service: DataService) {

    this.taskCtrl = new FormControl();

    this.taskCtrl.valueChanges.subscribe(state => {
      if (this.filterTasks(state).length == 1) {
        var selectedTask = this.filterTasks(state)[0];

        this.getTaskModelById(selectedTask.taskId);
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


  doGetEvent() {
    // this.service.getJsonFromServer().
    this.service.getTaskModelById("1").
    subscribe(
      data => {
        this.getData = JSON.stringify(data);
        console.log("I CANT SEE DATA HERE: ", this.getData);
      },
      // error => alert(error),
      () => console.log("request completed", this.getData)
    );
  }

  doYoutubeCheck() {
    this.service.youtubeCheck('UCrBhVZa7t7D5tZ979eBqO9g').
    subscribe(
      data => {
        let response: YouTubeVideoList = data;

        for (let i of response.items) {
          console.log(i.id.videoId); // "4", "5", "6"
        }
      },
      () => console.log("request completed", this.getData)
    );
  }

  getTaskModelById(taskId: string) {
    this.service.getTaskModelById(taskId).
    subscribe(
      data => {
        this.getData = JSON.stringify(data);
        // console.log("I CANT SEE DATA HERE: ", this.getData);
        console.log("I CANT SEE DATA HERE: ", data);
        this.countVideo = data.countOfVideo;
        this.countReklama = data.countOfReklama;
        this.countMove = data.countOfMove;
      },
      // error => alert(error),
      () => console.log("request completed", this.getData)
    );
  }

  testIterator() {
    // let list = [{a: 1}, {a: 5}, {a: 6}];
    //
    // for (let i in list) {
    //   console.log(i); // "0", "1", "2",
    // }
    //
    // for (let i of list) {
    //   console.log(i); // "4", "5", "6"
    // }
  }

}
