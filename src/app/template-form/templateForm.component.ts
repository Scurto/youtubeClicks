import {Component, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {YoutubeTask} from "../shared/YoutubeTask";
import {DataService} from "../shared/DataService";
import {TransferReklamaModel} from "../shared/TransferReklamaModel";
import {TransferModel} from "../shared/TransferModel";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs";

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

  // getData: string;
  // postData: string;
  toggleVideoSource: boolean = false;
  toggleVideoText: string = 'Java';
  isReadyToStart: boolean = false;
  title = 'app';
  YOUTUBE: string = 'https://www.youtube.com/watch?v=';
  countVideo: string;
  countReklama: string;
  countMove: string;
  startHtmlString: string;
  finishHtmlString: string;
  gClidContainerString: string;
  selectedTaskId: string;
  prepearedReklamaList: TransferReklamaModel[];
  prepearedModel: TransferModel;
  timerSubscription: Subscription;


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
    // this.startHtmlString = 'Лето в стране настало,<br>Вереск опять цветет.<br>Но некому готовить<br>Вересковый мед.';
    this.startHtmlString = '';
    this.finishHtmlString = '';
    this.isReadyToStart = false;
  }

  apply() {
    if (this.selectedTaskId != null) {
      Promise.resolve().then(_ => {
        if (this.toggleVideoSource) {
          return this.service.youtubeCheck('UCrBhVZa7t7D5tZ979eBqO9g').toPromise().then(
            data => {
              let response: YouTubeVideoList = data;
              let videoList: string[] = [];
              for (let i of response.items) {
                videoList.push(i.id.videoId);
              }
              console.log('videoList', videoList);
              return this.service.applyPromiseWithYoutubeList(this.selectedTaskId, this.countReklama, this.countMove, this.countVideo, videoList).toPromise();
            }
          );
        } else {
          return this.service.applyPromise(this.selectedTaskId, this.countReklama, this.countMove, this.countVideo).toPromise();
        }
      }).then(data => {
          this.prepearedModel = data.json();
          this.isReadyToStart = true;
          this.prepareTextForShow();
      }).catch(reason => {
        console.log('Promise fail', reason);
      });
    } else {
      console.log("ERROR");
    }

  }

  start() {
    let count = this.prepearedModel.transferVideoModel.length;
    let myText: string = '';


    var timerCounter;
    if (count < 4) {
      timerCounter =  150000;
    } else {
      timerCounter =  130000;
    }

    timerCounter =  3000;

    let timer = TimerObservable.create(timerCounter, timerCounter);

    let startDate = new Date();
    console.log("Call started at " + startDate);
    this.gClidContainerString = 'Call started at ' + startDate;
      this.timerSubscription = timer.subscribe(t => {

        if (t == count) {
          console.log('last iteration',t);
          this.stopTimer(t);
          this.writeResultToDb();
        } else {

          myText = myText + this.YOUTUBE + this.prepearedModel.transferVideoModel[t] + '<br>';

          if (this.prepearedModel.transferReklamaModel[t] != null) {
            Promise.resolve().then(_ => {
              return this.service.getGClid().toPromise();
            }).then(
              (data)=> {
                console.log('resp', data.text());
                myText = myText + this.prepearedModel.transferReklamaModel[t].gclidLine + data.text() + '<br>';

                for (let rekText of this.prepearedModel.transferReklamaModel[t].textLine) {
                  myText = myText + rekText + '<br>';
                }
                myText = myText + '<br>';
                this.finishHtmlString = myText;
              }
            );
          }

          console.log('iteration', t);

        }
      });



  }


  stopTimer(timer) {
    let stopDate = new Date();
    console.log('stopTimer', stopDate);
    this.gClidContainerString = this.gClidContainerString + '\n' + 'Call finished at ' + stopDate;
    this.timerSubscription.unsubscribe();
  }

  writeResultToDb() {
    // console.log('write data to db');
    // console.log('this.selectedTaskId', this.selectedTaskId);
    // console.log('this.prepearedModel.transferReklamaKeys', this.prepearedModel.transferReklamaKeys);

    this.service.updateTask(this.selectedTaskId, this.prepearedModel.transferReklamaKeys)
      .toPromise().then(result => {
      console.log('task completed');
    })
    ;
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

  private prepareTextForShow() {

    let myText: string = '';
    for (let i = 0; i < this.prepearedModel.transferVideoModel.length; i++) {

      myText = myText + this.YOUTUBE + this.prepearedModel.transferVideoModel[i] + '<br>';

      myText = myText + this.prepearedModel.transferReklamaModel[i].gclidLine + '<br>';

      for (let rekText of this.prepearedModel.transferReklamaModel[i].textLine) {
        myText = myText + rekText + '<br>';
      }

      myText = myText + '<br>';
    }


    this.startHtmlString = myText;
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
      () => console.log("request completed")
    );
  }

  doGclidCheck() {
    this.service.getGClid().toPromise().then(
      data => {
        console.log('data', data.text());
      }
    )
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
  }

  doChangeVideoSource(event) {
    this.toggleVideoSource = !this.toggleVideoSource;
    this.toggleVideoText =  (this.toggleVideoSource) ? 'Angular' : 'Java';
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

  id = 'qDuKsiwS5xw';
  private player;
  private ytEvent;

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

}
