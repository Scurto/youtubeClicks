export class YoutubeTask {
  taskId: string;
  countOfVideo: string;
  countOfReklama: string;
  countOfMove: string;
  reklamafreeze: number;
  videoFreeze: number


  constructor(taskId: string) {
    this.taskId = taskId;
    this.countOfVideo = '';
    this.countOfReklama = '';
    this.countOfMove = '';
  }
}
