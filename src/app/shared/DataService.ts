import {Http, Headers} from "@angular/http";
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
}
