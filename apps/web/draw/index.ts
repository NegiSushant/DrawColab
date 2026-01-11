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

  setSelectedTool(tool: "circle" | "pencil" | "rect" | "line") {
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
          shape.height,
          shape.width
        );
      } else if (shape.type === "circle") {
        this.drawEllipse(shape.startX, shape.startY, shape.height, shape.width);
      } else if (shape.type === "line") {
        this.drawLine(shape.fromX, shape.fromY, shape.toX, shape.toY);
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
      shape = {
        type: "circle",
        startX: this.startX,
        startY: this.startY,
        height: height,
        width: width,
      };
    } else if (selectedTool === "line") {
      shape = {
        type: "line",
        fromX: this.startX,
        fromY: this.startY,
        toX: event.clientX,
        toY: event.clientY,
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
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = "rgba(255,255,255)";
      const selectedTool = this.selectedTool;
      if (selectedTool === "rect") {
        this.drawRectangle(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        this.drawEllipse(this.startX, this.startY, height, width);
      } else if (selectedTool === "line") {
        const lEX = event.clientX;
        const lEY = event.clientY;
        this.drawLine(this.startX, this.startY, lEX, lEY);
      } else if (selectedTool === "pencil") {
        const canOffsetX = this.canvas.offsetLeft;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(event.clientX - canOffsetX, event.clientY);
        this.ctx.stroke();
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
