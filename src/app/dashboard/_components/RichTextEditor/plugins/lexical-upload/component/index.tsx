"use client";

import "./index.scss";
import { Media } from "@/payload-types";
import Image from "next/image";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SettingPopover } from "./setting";
import { ImageAttributes, ImageFormatType } from "../types";

export function ImageNoUpload({ onRemove }: { onRemove: () => void }) {
  return (
    <>
      <div className="upload__dropzoneAndUpload">
        <div className="dropzone dropzoneStyle--default">
          <div className="upload__dropzoneContent">
            <div className="upload__dropzoneContent__buttons">
              <button
                type="button"
                aria-disabled="false"
                className="btn upload__createNewToggler btn--icon-style-without-border btn--size-small btn--withoutPopup btn--style-pill btn--withoutPopup"
                onClick={onRemove}
              >
                <span className="btn__content">
                  <span className="btn__label">
                    This image was deleted, click to delete this.
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ImageUploaded({
  nodeKey,
  media,
  format,
  updateFormat,
  attributes,
  updateAttributes,
}: {
  nodeKey: string;
  media: Media;
  format?: ImageFormatType;
  updateFormat?: (format?: ImageFormatType) => void;
  attributes?: ImageAttributes | null;
  updateAttributes?: (attributes?: ImageAttributes) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  // useEffect(() => console.log(1111, media.alt, isSelected), [isSelected])

  // useEffect(() => {
  //     return editor.registerUpdateListener(({ editorState }) => {
  //         editorState.read(() => {
  //             // Any additional state sync, if needed
  //         });
  //     });
  // }, [editor]);

  // useEffect(() => {
  //     if (isSelected) {
  //         updateAttr('center');
  //     }
  // }, [isSelected]);

  return (
    <div className="upload__uploaded-wrapper">
      <div
        className="upload__uploaded"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.shiftKey) {
            clearSelection();
          }
          setSelected(!isSelected);
        }}
        style={{ textAlign: format }}
      >
        <Image
          src={media.url!}
          alt={media.alt}
          width={media.width || 300}
          height={media.height || 200}
          loading="lazy"
          className={`upload__uploaded-image ${isSelected ? " selected" : ""}`}
          style={attributes ?? {}}
        />
      </div>
      {isSelected && (
        <SettingPopover
          format={format}
          updateFormat={updateFormat}
          attributes={attributes}
          updateAttributes={updateAttributes}
        />
      )}
      {/*{isSelected && createPortal(<SettingPopover />, document.body)}*/}

      {/*{openMediaDialog && createPortal(*/}
      {/*    <MediaDialog*/}
      {/*        onClose={() => setOpenMediaDialog(false)}*/}
      {/*        onSelect={(media) => {*/}
      {/*            // console.log('selected', media.id, media.url, media.alt);*/}
      {/*            onSelect(media);*/}
      {/*            setOpenMediaDialog(false);*/}
      {/*        }}*/}
      {/*    />,*/}
      {/*    document.body*/}
      {/*)}*/}
    </div>
  );
}
