import {Http, Headers, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import {TransferReklamaModel} from "./TransferReklamaModel";
/**
 * Created by scurto on 04.09.2017.
 */

@Injectable()
export class DataService {
  constructor(private _http: Http) {}

  getTaskModelById(modelTaskId: string) {

    var json = JSON.stringify({taskId: modelTaskId});

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return  this._http.post("http://localhost:8080/getTaskModel",
      json,
      {
        headers: headers
      }
    ).map(res => res.json());
  }

  getLastUsedReklama(modelTaskId: string) {

    var json = JSON.stringify({taskId: modelTaskId});

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return  this._http.post("http://localhost:8080/getTaskModel",
      json,
      {
        headers: headers
      }
    ).map(res => res.json());
  }



  postJSON() {
    var json = JSON.stringify({var1: "test", var2: 3});
    var params = "json="+json;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.post(
      'http://validate.jsontest.com',
      params,
      {
        headers: headers
      }
    ).map(res => res.json());
  }

  youtubeCheck(chanelId: string) {

    let params: URLSearchParams = new URLSearchParams();
    params.set('part', "snippet");
    params.set('channelId', chanelId);
    params.set('maxResults', '50');
    params.set('order', 'date');
    params.set('key', 'AIzaSyD4uG1sdLHryZMwVDnUQBXXIdvGhAtGquA');

    return  this._http.get("https://www.googleapis.com/youtube/v3/search",
      {
        search: params
      },
    ).map(res => res.json());

  }

  apply(modelTaskId: string, countReklama: string, countMove: string, countVideo: string) {
    let json = JSON.stringify({
      taskId: modelTaskId,
      countOfReklama: countReklama,
      countOfMove: countMove,
      countOfVideo: countVideo
    });

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post("http://localhost:8080/youtube/reklamaListForShow",
      json,
      {
        headers: headers
      }
    ).map(res => res.json());
  }

  applyPromise(modelTaskId: string, countReklama: string, countMove: string, countVideo: string) {
    let json = JSON.stringify({
      taskId: modelTaskId,
      countOfReklama: countReklama,
      countOfMove: countMove,
      countOfVideo: countVideo
    });

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post("http://localhost:8080/youtube/reklamaListForShow",
      json,
      {
        headers: headers
      }
    );
  }

  applyPromiseWithYoutubeList(modelTaskId: string, countReklama: string, countMove: string, countVideo: string, listVideo: string[]) {
    let json = JSON.stringify({
      taskId: modelTaskId,
      countOfReklama: countReklama,
      countOfMove: countMove,
      countOfVideo: countVideo,
      listOfVideo: listVideo
    });

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.post("http://localhost:8080/youtube/getMixedList",
      json,
      {
        headers: headers
      }
    );
  }

  updateTask(modelTaskId: string, modelLastReklama: string) {
    var json = JSON.stringify({
      taskId: modelTaskId,
      lastReklama: modelLastReklama
    });

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return  this._http.post("http://localhost:8080/youtube/updateTask",
      json,
      {
        headers: headers
      }
    ).map(res => {
      console.log("update result->", res);
    });
  }

  getGClid() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http.get("http://localhost:8080/youtube/getGClid",
      // json,
      {
        headers: headers
      }
    );
  }




  private currentPriceUrl = 'http://api.coindesk.com/v1/bpi/currentprice.json';

  async getPrice(currency: string): Promise<number> {
    const response = await this._http.get(this.currentPriceUrl).toPromise();
    return response.json().bpi[currency].rate;
  }
}
