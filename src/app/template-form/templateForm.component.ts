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
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

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
  googleLink: string = "https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-2783044520727903&output=html&h=250&slotname=5375124397&adk=2419448805&adf=1842636954&w=300&loeid=38893311&url=http%3A%2F%2Fwww.jqueryscript.net%2F&ea=0&flash=0&wgl=1&adsid=NT&dt=1511261983354&bpp=59&bdt=175&fdt=318&idt=350&shv=r20171113&cbv=r20170110&saldr=sa&correlator=3271859956741&frm=24&ga_vid=1316891360.1511261984&ga_sid=1511261984&ga_hid=725781493&ga_fc=0&pv=2&iag=12&icsg=0&nhd=2&dssz=2&mdo=0&mso=0&u_tz=120&u_his=6&u_java=0&u_h=1080&u_w=1920&u_ah=1080&u_aw=1858&u_cd=24&u_nplug=4&u_nmime=5&adx=0&ady=0&biw=-12245933&bih=-12245933&isw=300&ish=250&ifk=3457247614&eid=21060867%2C21061122%2C38893301&oid=3&nmo=1&zm=4.38&loc=https%3A%2F%2Fwww.jqueryscript.net%2F&rx=0&eae=2&brdim=390%2C128%2C390%2C128%2C1858%2C0%2C1314%2C772%2C300%2C250&vis=1&rsz=%7C%7CcoE%7C&abl=NS&ppjl=f&pfx=0&fu=16&bc=1&jar=2017-11-21-10&ifi=1&dtd=401";
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
  showBanner: boolean = false;
  autoCloseAdvertiseFlag: boolean = true;
  private player;
  private ytEvent;
  private audio;

  @ViewChild('finishHtml') finishHtml;
  @ViewChild('descriptioHtml') descriptioHtml;


  listYoutubeTasks: YoutubeTask[] = [
  ];


  constructor(private service: DataService) {

    this.taskCtrl = new FormControl();

    this.service.getListYoutubeTasksId().toPromise().then(result => {
      this.listYoutubeTasks = result;
      console.log('RESULT', result);
      this.taskCtrl.valueChanges.subscribe(state => {
        if (state != null) {
          this.selectedTaskId = state;
          this.getTaskModelById(this.selectedTaskId, this.listYoutubeTasks);
        }
      });

      this.filteredYoutubeTasks = this.taskCtrl.valueChanges
        .startWith(null)
        .map(taskId => taskId ? this.filterTasks(taskId) : this.listYoutubeTasks.slice());
    });
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
    let googleLink: string = "https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-2783044520727903&output=html&h=250&slotname=5375124397&adk=2419448805&adf=1842636954&w=300&loeid=38893311&url=http%3A%2F%2Fwww.jqueryscript.net%2F&ea=0&flash=0&wgl=1&adsid=NT&dt=1511261983354&bpp=59&bdt=175&fdt=318&idt=350&shv=r20171113&cbv=r20170110&saldr=sa&correlator=3271859956741&frm=24&ga_vid=1316891360.1511261984&ga_sid=1511261984&ga_hid=725781493&ga_fc=0&pv=2&iag=12&icsg=0&nhd=2&dssz=2&mdo=0&mso=0&u_tz=120&u_his=6&u_java=0&u_h=1080&u_w=1920&u_ah=1080&u_aw=1858&u_cd=24&u_nplug=4&u_nmime=5&adx=0&ady=0&biw=-12245933&bih=-12245933&isw=300&ish=250&ifk=3457247614&eid=21060867%2C21061122%2C38893301&oid=3&nmo=1&zm=4.38&loc=https%3A%2F%2Fwww.jqueryscript.net%2F&rx=0&eae=2&brdim=390%2C128%2C390%2C128%2C1858%2C0%2C1314%2C772%2C300%2C250&vis=1&rsz=%7C%7CcoE%7C&abl=NS&ppjl=f&pfx=0&fu=16&bc=1&jar=2017-11-21-10&ifi=1&dtd=401";
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
    } else if (this.strategy == 'rpte') {
      randomPositionTextEndStrategy(this.service, this.selectedTaskId, this.prepearedModel, this.finishHtml, this.player, this.reklamaFreeze, this.videoFreeze, this.descriptioHtml, this.audio);
    }

    async function randomPositionTextEndStrategy(service: DataService, selectedTaskId, prepearedModel, finishHtml, player, reklamaFreeze, videoFreeze, descriptioHtml, audio) {
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

      // Math.floor(Math.random()*10);


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
      var afterMyText = '';
      myText = myText + '<br>';

      for (let i = 0; i < prepearedModel.transferVideoModel.length; i++) {
        myText = myText + YOUTUBE + prepearedModel.transferVideoModel[i] + '<br>';
        player.loadVideoById(prepearedModel.transferVideoModel[i]);
        player.playVideo();
        finishHtml.nativeElement.innerHTML = myText;
        await delay(videoDelay);
        if (i == 3 || i == 4 && prepearedModel.transferReklamaModel.length > 0) {
          window.open(googleLink, "_blank");
          await delay(3000);
          service.getGClid().toPromise().then(result => {
            afterMyText = afterMyText + prepearedModel.transferReklamaModel[0].gclidLine + result.text() + '<br>';
          });
          await delay(primaryReklamaDelay);

          for (let rekText of prepearedModel.transferReklamaModel[0].textLine) {
            afterMyText = afterMyText + rekText + '<br>';
            await delay(secondaryReklamaDelay);
          }

          prepearedModel.transferReklamaModel.splice(0, 1);

          afterMyText = afterMyText + '<br>';
        }
      }

      finishHtml.nativeElement.innerHTML = myText + '<br>' + afterMyText;

      await delay(finishDelay);
      service.updateTask(selectedTaskId, prepearedModel.transferReklamaKeys)
        .toPromise().then(result => {
        console.log('task completed');
      });

      descriptionText = descriptionText + '<br>' + '===FINISH AT===' + '<br>' +  new Date().toString()+ '<br>';
      descriptioHtml.nativeElement.innerHTML = descriptionText;
      audio.play();
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
      console.log('test1');

      let startDelay: number = 35000;
      let videoDelay: number = videoFreeze * 1000;
      let primaryReklamaDelay: number = reklamaFreeze * 1000;
      let secondaryReklamaDelay: number = reklamaFreeze * 1000;
      let finishDelay: number = 35000;

      console.log('test2');
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
        if (prepearedModel.transferReklamaModel.length > 0) {
          window.open(googleLink, "_blank");
          await delay(3000);
          service.getGClid().toPromise().then(result => {
            myText = myText + prepearedModel.transferReklamaModel[0].gclidLine + result.text() + '<br>';
            finishHtml.nativeElement.innerHTML = myText;

          });
          await delay(primaryReklamaDelay);

          for (let rekText of prepearedModel.transferReklamaModel[0].textLine) {
            myText = myText + rekText + '<br>';
            finishHtml.nativeElement.innerHTML = myText;
            await delay(secondaryReklamaDelay);
          }

          prepearedModel.transferReklamaModel.splice(0, 1);
          finishHtml.nativeElement.innerHTML = myText;
        }
        myText = myText + '<br>';
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
      myText = myText + '<br>';
    }

    for (let i = 0; i < this.prepearedModel.transferReklamaModel.length; i++) {
      myText = myText + this.prepearedModel.transferReklamaModel[i].gclidLine + '<br>';

      for (let rekText of this.prepearedModel.transferReklamaModel[i].textLine) {
          myText = myText + rekText + '<br>';
      }

      myText = myText + '<br>';

    }

    this.startHtmlString = myText;
  }

  testJms() {
    this.service.testJms().toPromise().then(result => {
      console.log("my Gclids", result);
    });
  }

  openGclidPage() {
    window.open(this.googleLink, "_blank");
    window.open(this.googleLink, "_blank");
    window.open(this.googleLink, "_blank");
    window.open(this.googleLink, "_blank");
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
    this.showBanner = !this.showBanner;
    // var a = window.open(this.googleLink, "_blank");
    // console.log('a', a);
    // this.service.getGClidTest().toPromise().then(
    //   data => {
    //     console.log('data', data.text());
    //   }
    // )
  }

  getTaskModelById(taskId: string, listYoutubeTasks: YoutubeTask[]) {
    console.log('taskId', taskId);
    for (let task of listYoutubeTasks) {
      if (taskId == task.taskId) {
        this.countVideo = task.countVideo;
        this.countReklama = task.countReklama;
        this.countMove = task.countMove;
        this.reklamaFreeze = task.reklamaFreeze;
        this.videoFreeze = task.videoFreeze;
        this.strategy = task.strategy;
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
    this.audio = new Audio('assets/audio/test.mp3');
    // this.audio.src = "https://dll.zf.fm/music/2/a7/imagine_dragons_-_thunder_(zf.fm).mp3";
    // this.audio.src = "./test.mp3";
    this.audio.load();
    this.audio.play();
  }

  stopMusic() {
    this.audio.pause();
  }

  autoCloseAdvertise(event) {
    console.log('event', event.checked);
    let autoClose: string = event.checked ? "": "no";
    this.service.autoCloseAdvertise(autoClose).subscribe(
      data => {
        console.log("autoCloseAdvertise -> ", data);
      },
      // error => alert(error),
      () => console.log("request completed")
    );
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
