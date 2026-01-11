import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";

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
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "line";
      startx: number;
      starty: number;
      endx: number;
      endy: number;
    };

export class Draw {
  private startX: number = 0;
  private startY: number = 0;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private startPrint: boolean;
  private roomId: string;
  private existingShape: Shape[];
  private selectedTool: Tool = "pencil";

  private socket: WebSocket;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.socket = socket;
    this.roomId = roomId;
    this.startPrint = false;
    this.existingShape = [];
    this.init();
    this.initMouseHandlers();
  }

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  async init() {
    this.existingShape = await getExistingShapes(this.roomId);
    console.log(this.existingShape);
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

  setSelectedTool(tool: Tool) {
    this.selectedTool = tool;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(255, 255, 255)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShape.map((shape) => {
      if (shape.type === "rect") {
        this.ctx.fillStyle = "rgba(255, 255, 255)";
        this.ctx.fillRect(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height
        );
      }
    });
  }
  //when mouseclick on canvas
  mouseDownHandler = (event: MouseEvent) => {
    this.startPrint = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  };

  //when mousereliease from the canvas
  mouseUpHandler = (event: MouseEvent) => {
    this.startPrint = false;
    const height = event.clientX - this.startX;
    const width = event.clientY - this.startY;

    const selectedTool: Tool = this.selectedTool;

    let shape: Shape | null = null;

    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        startX: this.startX,
        startY: this.startY,
        width: width,
        height: height,
      };
    } else if (selectedTool === "circle") {
      const radius = Math.max(height, width) / 2;
      shape = {
        type: "circle",
        radius: radius,
        x: height,
        y: width,
      };
    } else if (selectedTool === "line") {
      shape = {
        type: "line",
        startx: this.startX,
        starty: this.startY,
        endx: event.clientX,
        endy: event.clientY,
      };
    } else if (selectedTool === "pencil") {
      this.ctx.stroke();
      this.ctx.beginPath();
    }
    if (!shape) return;

    this.existingShape.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );
  };

  //when mouse move after the click on the canvas
  mouseMoveHandler = (event: MouseEvent) => {
    if (this.startPrint) {
      const width = event.clientX - this.startX;
      const height = event.clientY - this.startY;
      this.clearCanvas();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = "white";
      const selectedTool = this.selectedTool;
      if (selectedTool === "rect") {
        this.drawRectangle(this.startX, this.startY, width, height);
        // this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        // const radius = Math.max(width, height) / 2;
        // const cx = radius + this.startX;
        // const cy = radius + this.startY;
        // this.ctx.beginPath();
        // this.ctx.arc(cx, cy, Math.abs(radius), 0, Math.PI * 2);
        // this.ctx.stroke();
        // this.ctx.closePath();
        this.drawEllipse(this.startX, this.startY, height, width);
      } else if (selectedTool === "line") {
        const lEX = event.clientX;
        const lEY = event.clientY;
        this.drawLine(this.startX, this.startY, lEX, lEY);
        // this.ctx.beginPath();
        // this.ctx.moveTo(this.startX, this.startY);
        // this.ctx.lineTo(lEX, lEY);
        // this.ctx.stroke();
      } else if (selectedTool === "pencil") {
        
        const canOffsetX = this.canvas.offsetLeft;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(event.clientX - canOffsetX, event.clientY);
        this.ctx.stroke();
      }
    }
  };

  //Drawing Rectangle shape
  drawRectangle(startX: number, startY: number, height: number, width: number) {
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
    this.ctx.beginPath();
    this.ctx.ellipse(
      startX,
      startY,
      width < 0 ? 1 : width,
      height < 0 ? 1 : height,
      0,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
  }
  drawPencile() {
    // const path = new Path2D()
  }
}
