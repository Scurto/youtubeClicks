export class YoutubeTask {
  taskId: string;
  countOfVideo: string;
  countOfReklama: string;
  countOfMove: string;
  prevDate: string;
  prevReklama: string;


  constructor(taskId: string) {
    this.taskId = taskId;
    this.countOfVideo = '';
    this.countOfReklama = '';
    this.countOfMove = '';
    this.prevDate = '';
    this.prevReklama = '';
  }
}
