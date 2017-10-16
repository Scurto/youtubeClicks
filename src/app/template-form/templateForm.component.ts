import {Component, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {YoutubeTask} from "../shared/YoutubeTask";
import {DataService} from "../shared/DataService";
import {TransferReklamaModel} from "../shared/TransferReklamaModel";
import {TransferModel} from "../shared/TransferModel";

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
  selectedTaskId: string;
  prepearedReklamaList: TransferReklamaModel[];
  prepearedModel: TransferModel;


  listYoutubeTasks: YoutubeTask[] = [
    new YoutubeTask("1"),
    new YoutubeTask("2"),
    new YoutubeTask("3"),
    new YoutubeTask("4"),
    new YoutubeTask("5")
  ];


  constructor(private service: DataService) {

    this.taskCtrl = new FormControl();

    this.taskCtrl.valueChanges.subscribe(state => {
      console.log('state', state);
      if (state != null) {
          this.selectedTaskId = state;
          this.getTaskModelById(this.selectedTaskId);
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
    this.taskCtrl.reset();
    this.theHtmlString = 'Лето в стране настало,<br>Вереск опять цветет.<br>Но некому готовить<br>Вересковый мед.';
  }

  apply() {
    if (this.selectedTaskId != null) {
      const makeRequest = async () => {
        await this.prepearedReklamaListPromise();
        // this.peeperTextForShow();
      };

      makeRequest();



    } else {
      console.log("ERROR");
    }

  }

  private prepearedReklamaListPromise() { // import 'rxjs/add/operator/toPromise';

   return this.service.applyPromise(this.selectedTaskId, this.countReklama, this.countMove, this.countVideo).toPromise().then(
     data => { // Success
        console.log('promiseExample', data.json());
        this.prepearedReklamaList = data.json();
      }
    );
  }


  private prepearedReklamaListObservable() {
    this.service.apply(this.selectedTaskId,
      this.countReklama,
      this.countMove, this.countVideo).subscribe(
      data => {
        this.prepearedModel = data;
        console.log("http://localhost:8080/youtube/reklamaListForShow -> ", data);
      },
      // error => alert(error),
      () => console.log("request completed")
    );
  }

  private peeperTextForShow() {
    console.log('peeperTextForShow', this.prepearedReklamaList);
    let myText: string = '';
    for (let text of this.prepearedReklamaList) {
      myText = myText + text.gclidLine + '<br>';

      for (let textL of text.textLine) {
        myText = myText + textL + '<br>';
      }

      myText = myText + '<br>';
    }

    this.theHtmlString = myText;
  }


  doGetEvent() {

  }

  doYoutubeCheck() {
    this.service.youtubeCheck('UCrBhVZa7t7D5tZ979eBqO9g').
    subscribe(
      data => {
        let response: YouTubeVideoList = data;

        for (let i of response.items) {
          console.log(i.id.videoId); // "4", "5", "6"
        }

        return response.items;
      },
      () => console.log("request completed", this.getData)
    );
  }

  getTaskModelById(taskId: string) {
    switch(taskId) {
      case "1": {
        this.countVideo = "3";
        this.countReklama = "3";
        this.countMove = "3";
        break;
      }
      case "2": {
        this.countVideo = "2";
        this.countReklama = "2";
        this.countMove = "2";
        break;
      }
      case "3": {
        this.countVideo = "3";
        this.countReklama = "3";
        this.countMove = "3";
        break;
      }
      case "4": {
        this.countVideo = "1";
        this.countReklama = "1";
        this.countMove = "1";
        break;
      }
      case "5": {
        this.countVideo = "2";
        this.countReklama = "3";
        this.countMove = "2";
        break;
      }
      default: {
        //statements;
        break;
      }
    }

    // this.getLastUsedReklama(taskId)
  }

  getLastUsedReklama(taskId: string) {
    this.service.getLastUsedReklama(taskId).
    subscribe(
      data => {
        this.getData = JSON.stringify(data);
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
