import {Component, Output, ViewChild} from '@angular/core';
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
  videoFreeze: number;
  reklamaFreeze: number;
  startHtmlString: string;
  finishHtmlString: string;
  descriptionContainerString: string;
  selectedTaskId: string;
  prepearedReklamaList: TransferReklamaModel[];
  prepearedModel: TransferModel;
  timerSubscription: Subscription;
  failIterator: number = 0;
  strategy: string;
  localVideoId: string = '';
  private player;
  private ytEvent;
  private audio;

  @ViewChild('finishHtml') finishHtml;
  @ViewChild('descriptioHtml') descriptioHtml;


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
    this.reklamaFreeze = null;
    this.videoFreeze = null;
    this.taskCtrl.reset();
    this.startHtmlString = '';
    this.finishHtmlString = '';
    this.isReadyToStart = false;
    this.descriptionContainerString = '';
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
        if (this.failIterator < 10) {
          this.apply();
          this.failIterator++;
        } else {
          this.failIterator = 0;
          console.log('ALL BAD');
        }

      });
    } else {
      console.log("ERROR");
    }

  }

  start() {
    let count = this.prepearedModel.transferVideoModel.length;

    const delay = (amount: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, amount);
      });
    };

    this.audio = new Audio();
    this.audio.src = "http://rt4.funformobile.com/d/841/941/ddhhv2atfi/tvbadboys.mp3";
    this.audio.load();

    if (this.strategy == 'classic') {
      classicStrategy(this.service, this.selectedTaskId, this.prepearedModel, this.finishHtml, this.player, this.reklamaFreeze, this.videoFreeze, this.descriptioHtml, this.audio);
    } else {

    }


    async function classicStrategy(service: DataService, selectedTaskId, prepearedModel, finishHtml, player, reklamaFreeze, videoFreeze, descriptioHtml, audio) {
      if (service == null ||
          selectedTaskId == null ||
          prepearedModel == null ||
          finishHtml == null||
          descriptioHtml == null||
          player == null ||
          audio == null ||
          reklamaFreeze == null || videoFreeze == null) {
            console.log("AHTUNG !!!!");
            return;
      }

      let startDelay: number = 10000;
      let videoDelay: number = videoFreeze * 1000;
      let primaryReklamaDelay: number = reklamaFreeze * 1000;
      let secondaryReklamaDelay: number = reklamaFreeze * 1000;
      let finishDelay: number = 10000;

      let descriptionText = '===START AT===' + '<br>';
      descriptionText = descriptionText + new Date().toString();
      descriptioHtml.nativeElement.innerHTML = descriptionText + '<br>' + '<br>';
      player.mute();
      let YOUTUBE: string = 'https://www.youtube.com/watch?v=';

      await delay(startDelay);


      var myText = 'https://www.youtube.com/' + prepearedModel.transferChanelId + '<br>';
      myText = myText + '<br>';

      for (let i = 0; i < prepearedModel.transferVideoModel.length; i++) {
        myText = myText + YOUTUBE + prepearedModel.transferVideoModel[i] + '<br>';
        player.loadVideoById(prepearedModel.transferVideoModel[i]);
        player.playVideo();
        finishHtml.nativeElement.innerHTML = myText;
        await delay(videoDelay);
        if (prepearedModel.transferReklamaModel[i] != null) {
          service.getGClid().toPromise().then(result => {
            myText = myText + prepearedModel.transferReklamaModel[i].gclidLine + result.text() + '<br>';
            finishHtml.nativeElement.innerHTML = myText;
          });
          await delay(primaryReklamaDelay);

          for (let rekText of prepearedModel.transferReklamaModel[i].textLine) {
            myText = myText + rekText + '<br>';
            finishHtml.nativeElement.innerHTML = myText;
            await delay(secondaryReklamaDelay);
          }
          myText = myText + '<br>';
          finishHtml.nativeElement.innerHTML = myText;
        }
      }

      await delay(finishDelay);
      service.updateTask(selectedTaskId, prepearedModel.transferReklamaKeys)
        .toPromise().then(result => {
        console.log('task completed');
      });

      descriptionText = descriptionText + '<br>' + '===FINISH AT===' + '<br>' +  new Date().toString()+ '<br>';
      descriptioHtml.nativeElement.innerHTML = descriptionText;
      audio.play();
    }

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
    console.log('this.prepearedModel', this.prepearedModel);
    for (let i = 0; i < this.prepearedModel.transferVideoModel.length; i++) {

      myText = myText + this.YOUTUBE + this.prepearedModel.transferVideoModel[i] + '<br>';
      if (this.prepearedModel.transferReklamaModel[i] != null) {
        myText = myText + this.prepearedModel.transferReklamaModel[i].gclidLine + '<br>';

        for (let rekText of this.prepearedModel.transferReklamaModel[i].textLine) {
          myText = myText + rekText + '<br>';
        }
      }

      myText = myText + '<br>';
    }


    this.startHtmlString = myText;
  }

  doYoutubeCheck() {
    this.service.youtubeCheck('UCrBhVZa7t7D5tZ979eBqO9g').subscribe(
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
    this.strategy = 'classic';
    switch (taskId) {
      case "1": {
        this.countVideo = "3";
        this.countReklama = "3";
        this.countMove = "3";
        this.reklamaFreeze = 30;
        this.videoFreeze = 30;
        break;
      }
      case "2": {
        this.countVideo = "2";
        this.countReklama = "2";
        this.countMove = "2";
        this.reklamaFreeze = 30;
        this.videoFreeze = 30;
        break;
      }
      case "3": {
        this.countVideo = "7";
        this.countReklama = "3";
        this.countMove = "3";
        this.reklamaFreeze = 30;
        this.videoFreeze = 30;
        break;
      }
      case "4": {
        this.countVideo = "1";
        this.countReklama = "1";
        this.countMove = "1";
        this.reklamaFreeze = 30;
        this.videoFreeze = 30;
        break;
      }
      case "5": {
        this.countVideo = "2";
        this.countReklama = "3";
        this.countMove = "2";
        this.reklamaFreeze = 30;
        this.videoFreeze = 30;
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
    this.toggleVideoText = (this.toggleVideoSource) ? 'Angular' : 'Java';
  }

  onStateChange(event) {
    this.ytEvent = event.data;

  }

  savePlayer(player) {
    this.player = player;
  }

  startMusic() {
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
  }

}

// ng build --target=development --environment=dev

// testIterator() {
  // let list = [{a: 1}, {a: 5}, {a: 6}];
  //
  // for (let i in list) {
  //   console.log(i); // "0", "1", "2",
  // }
  //
  // for (let i of list) {
  //   console.log(i); // "4", "5", "6"
  // }
// }
