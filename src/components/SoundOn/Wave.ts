import Point from "./Point";

export default class Wave {
  totalPoints: number;
  color: string;
  lineWidth: number;
  points: Point[] = [];

  stageWidth = 0;
  stageHeight = 0;
  centerY = 0;
  pointGap = 0;

  constructor(totalPoints = 9, color = "white", lineWidth = 2) {
    this.totalPoints = totalPoints;
    this.color = color;
    this.lineWidth = lineWidth;
    this.points = [];
  }

  resize(stageWidth: number, stageHeight: number): void{
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;
    this.centerY = stageHeight / 2;
    this.pointGap = stageWidth / (this.totalPoints - 1);
    this.init();
  }

  init() : void {
    this.points = [];
    for (let i = 0; i < this.totalPoints; i++) {
      this.points[i] = new Point(
        i,
        this.pointGap * i,
        this.centerY,
        this.stageHeight
      );
    }
  }

  draw(ctx : CanvasRenderingContext2D, animate: boolean): void {
    if (this.points.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = "round";

    let prevX = this.points[0].x;
    let prevY = this.points[0].y;
    ctx.moveTo(prevX, prevY);

    for (let i = 1; i < this.totalPoints; i++) {
      // 양 끝점은 고정해서 선이 화면 밖으로 안 나가게
      if (i < this.totalPoints - 1) {
        if (animate) {
            this.points[i].update();
        } else {
            this.points[i].settle();
        }
        }
    
     // 현재 점(points[i])을 control point로,
      // 다음 점과의 중점을 목적지로 삼는다
      const next = this.points[i + 1] ?? this.points[i];
      const midX = (this.points[i].x + next.x) / 2;
      const midY = (this.points[i].y + next.y) / 2;
      ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, midX, midY);

    }
    ctx.stroke();
  }
  
   
}
  
