import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";
import getStroke from "perfect-freehand";

type Point = { x: number; y: number };

type Shape =
  | {
      type: "rect";
      startX: number;
      startY: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      startX: number;
      startY: number;
      height: number;
      width: number;
    }
  | {
      type: "line";
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
    }
  | {
      type: "pencil";
      points: Point[];
    };

export class Draw {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startX: number = 0;
  private startY: number = 0;
  private startPrint: boolean;
  private roomId: string;
  private existingShape: Shape[];
  private selectedTool: Tool = "pencil";
  private currentPencilPoints: Point[] = [];

  private socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.socket = socket;
    this.roomId = roomId;
    this.startPrint = false;
    this.existingShape = [];

    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  async init() {
    this.existingShape = await getExistingShapes(this.roomId);
    // console.log(this.existingShape);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parseData = JSON.parse(message.message);
        this.existingShape.push(parseData.shape);
        this.clearCanvas();
      }
    };
  }

  setSelectedTool(tool: "circle" | "pencil" | "rect" | "line" | "erase") {
    this.selectedTool = tool;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShape.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeStyle = "rgba(255, 255, 255)";
        this.drawRectangle(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height,
        );
      } else if (shape.type === "circle") {
        this.drawEllipse(shape.startX, shape.startY, shape.height, shape.width);
      } else if (shape.type === "line") {
        this.drawLine(shape.fromX, shape.fromY, shape.toX, shape.toY);
      } else if (
        shape.type === "pencil" &&
        Array.isArray(shape.points) &&
        shape.points.length > 0
      ) {
        this.drawPencil(shape.points);
      }
    });
  }

  //when mouseclick on canvas
  mouseDownHandler = (event: MouseEvent) => {
    this.startPrint = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x: event.clientX, y: event.clientY }];
    }
  };

  //when mousereliease from the canvas
  mouseUpHandler = (event: MouseEvent) => {
    if (!this.startPrint) return;

    this.startPrint = false;

    const endX = event.clientX;
    const endY = event.clientY;

    const x = Math.min(this.startX, endX);
    const y = Math.min(this.startY, endY);

    const width = Math.abs(endX - this.startX);
    const height = Math.abs(endY - this.startY);

    const selectedTool: Tool = this.selectedTool;

    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        startX: x,
        startY: y,
        width: width,
        height: height,
      };
    } else if (selectedTool === "circle") {
      shape = {
        type: "circle",
        startX: x,
        startY: y,
        height: height,
        width: width,
      };
    } else if (selectedTool === "line") {
      shape = {
        type: "line",
        fromX: this.startX,
        fromY: this.startY,
        toX: endX,
        toY: endY,
      };
    } else if (selectedTool === "pencil") {
      shape = {
        type: "pencil",
        points: this.currentPencilPoints,
      };
      this.currentPencilPoints = [];
    }
    if (!shape) return;

    this.existingShape.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      }),
    );
  };

  //when mouse move after the click on the canvas
  mouseMoveHandler = (event: MouseEvent) => {
    if (this.startPrint) {
      const currentX = event.clientX;
      const currentY = event.clientY;

      const x = Math.min(this.startX, currentX);
      const y = Math.min(this.startY, currentY);

      const width = Math.abs(currentX - this.startX);
      const height = Math.abs(currentY - this.startY);

      this.clearCanvas();
      this.drawPencil(this.currentPencilPoints);
      this.ctx.strokeStyle = "rgba(255,255,255)";

      const selectedTool = this.selectedTool;

      if (selectedTool === "rect") {
        this.drawRectangle(x, y, width, height);
      } else if (selectedTool === "circle") {
        this.drawEllipse(x, y, height, width);
      } else if (selectedTool === "line") {
        this.drawLine(this.startX, this.startY, currentX, currentY);
      } else if (selectedTool === "pencil") {
        this.currentPencilPoints.push({
          x: currentX,
          y: currentY,
        });
        return;
      }
    }
  };

  //Drawing Rectangle shape
  drawRectangle(startX: number, startY: number, width: number, height: number) {
    this.ctx.strokeRect(startX, startY, width, height);
  }

  //Drawing the line shape
  drawLine(fromX: number, fromY: number, toX: number, toY: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();
  }
  //drawing ellipse/circle
  drawEllipse(startX: number, startY: number, height: number, width: number) {
    // const radius = Math.max(height, width) / 2;
    // this.ctx.beginPath();
    // this.ctx.ellipse(
    //   startX,
    //   startY,
    //   width < 0 ? 1 : width,
    //   height < 0 ? 1 : height,
    //   0,
    //   0,
    //   2 * Math.PI,
    // );
    // this.ctx.stroke();

    const centerX = startX + width / 2;
    const centerY = startY + height / 2;

    const radiusX = width / 2;
    const radiusY = height / 2;

    this.ctx.beginPath();
    this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  //drawing pencil/free drawing
  drawPencil(points: Point[]) {
    if (points.length < 2) return;

    const stroke = getStroke(
      points.map((p) => [p.x, p.y]),
      {
        size: 5,
        thinning: 0.6,
        smoothing: 0.5,
        streamline: 0.5,
        easing: (t) => Math.sin((t * Math.PI) / 2),
        simulatePressure: true,
        last: true,
      },
    );

    const ctx = this.ctx;
    ctx.fillStyle = "white";
    ctx.beginPath();

    stroke.forEach(([x, y], i) => {
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fill();
  }

  //Erase items or figures
  EraseItem(){
    
  }
}
