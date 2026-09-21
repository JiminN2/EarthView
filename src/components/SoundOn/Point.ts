export default class Point {
    x: number;
    y: number;
    fixedY: number;
    speed : number;
    cur: number;
    max: number;


  constructor(index:number, x: number, y: number, stageHeight: number) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 0.04;
    this.cur = index * 0.8;                 // 점마다 위상을 다르게
    this.max = Math.random() * (stageHeight / 5) + stageHeight / 9;
  }

  update() : void {
    this.cur += this.speed;
    this.y = this.fixedY + Math.sin(this.cur) * this.max;
  }

  // sound off 일 때 부드럽게 일직선으로 복귀
  settle() : void {
    this.y += (this.fixedY - this.y) * 0.1;
  }
}