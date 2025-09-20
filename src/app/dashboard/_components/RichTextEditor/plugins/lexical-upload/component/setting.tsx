import {
  ImageAttributes,
  ImageFormatType,
} from "@/app/dashboard/_components/RichTextEditor/plugins/lexical-upload/types";
import { ReactElement, useEffect, useState } from "react";
import { Icons } from "../../ToolbarPlugin/components/Icons";

const FORMAT_TYPES: { type: ImageFormatType; icon: ReactElement }[] = [
  { type: "left", icon: Icons.alignLeft },
  { type: "center", icon: Icons.alignCenter },
  { type: "right", icon: Icons.alignRight },
];

const formatInputSize = (_v: string): string => {
  const v = _v.trim().replaceAll(" ", "");
  if (v.endsWith("px") || v.endsWith("%")) {
    return v;
  }
  return v.length ? `${v}px` : "";
};

export function SettingPopover({
  format,
  updateFormat,
  attributes,
  updateAttributes,
}: {
  format?: ImageFormatType;
  updateFormat?: (val?: ImageFormatType) => void;
  attributes?: ImageAttributes | null;
  updateAttributes?: (attributes?: ImageAttributes) => void;
}) {
  const [tempAttributes, setTempAttributes] = useState<ImageAttributes>(
    attributes ?? { width: "", height: "" },
  );
  useEffect(() => {
    console.log("tempAttributes", tempAttributes);
  }, [tempAttributes]);

  return (
    <div
      className="upload__setting-popover"
      onClick={(e) => {
        // e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        // e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="upload__setting-popover-container">
        <div className="upload__setting-popover-header">Setting Attributes</div>
        <div className="upload__setting-popover-body">
          <div className="upload__setting-popover-row">
            <div className="upload__setting-popover-label">Align:</div>
            <div className="upload__setting-popover-actions">
              {FORMAT_TYPES.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  className={`upload__setting-popover-icon-btn ${format === item.type ? "active" : ""}`}
                  title={`Align ${item.type}`}
                  onClick={() => updateFormat?.(item.type)}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="upload__setting-popover-row">
            <div className="upload__setting-popover-label">Size:</div>
            <div className="upload__setting-popover-actions">
              <input
                type="text"
                className="upload__setting-popover-input"
                placeholder="300px | 100%"
                value={tempAttributes.width}
                onChange={(e) => {
                  setTempAttributes((prev) => ({
                    ...prev,
                    width: e.target.value,
                  }));
                  updateAttributes?.({
                    ...attributes,
                    width: formatInputSize(e.target.value),
                  });
                }}
                onBlur={(e) => {
                  const width = formatInputSize(e.target.value);
                  console.log("onBlur", e.target.value, width);
                  setTempAttributes((prev) => ({ ...prev, width }));
                  updateAttributes?.({ ...attributes, width });
                }}
              />
              ✖️
              <input
                type="text"
                className="upload__setting-popover-input"
                placeholder="200px | auto"
                value={tempAttributes.height}
                onChange={(e) => {
                  setTempAttributes((prev) => ({
                    ...prev,
                    height: e.target.value,
                  }));
                  updateAttributes?.({
                    ...attributes,
                    height: formatInputSize(e.target.value),
                  });
                }}
                onBlur={(e) => {
                  const height = formatInputSize(e.target.value);
                  setTempAttributes((prev) => ({ ...prev, height }));
                  updateAttributes?.({ ...attributes, height });
                }}
              />
            </div>
          </div>
        </div>
        {/*<div className="upload__setting-popover-footer">*/}
        {/*    <button>Save</button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
