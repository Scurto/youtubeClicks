import {Http, Headers, URLSearchParams} from "@angular/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
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

  youtubeCheck() {

    let params: URLSearchParams = new URLSearchParams();
    params.set('part', "snippet");
    params.set('channelId', 'UCrBhVZa7t7D5tZ979eBqO9g');
    params.set('maxResults', '50');
    params.set('order', 'date');
    params.set('key', 'AIzaSyD4uG1sdLHryZMwVDnUQBXXIdvGhAtGquA');

    return  this._http.get("https://www.googleapis.com/youtube/v3/search",
      {
        search: params
      },
    ).map(res => res.json());

  }
}
