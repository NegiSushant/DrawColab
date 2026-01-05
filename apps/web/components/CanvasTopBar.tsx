import { Tool } from "./Canvas";
import { IconButton } from "./IconButton";

export default function CanvasTopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <div className="flex gap-t">
        <IconButton
          onClick={() => {
            setSelectedTool("pencil");
          }}
          activated={selectedTool === "pencil"}
          icon={"pen"}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("circle");
          }}
          activated={selectedTool === "circle"}
          icon={"cer"}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("rect");
          }}
          activated={selectedTool === "rect"}
          icon={"rect"}
        />
      </div>
    </div>
  );
}
