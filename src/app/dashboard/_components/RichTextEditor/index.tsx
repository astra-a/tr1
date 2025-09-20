import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { DefaultTheme } from "./themes";
import { ParagraphNode, TextNode } from "lexical";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import BoldButton from "./plugins/ToolbarPlugin/components/BoldButton";
import ItalicButton from "./plugins/ToolbarPlugin/components/ItalicButton";
import UnderlineButton from "./plugins/ToolbarPlugin/components/UnderlineButton";
import StrikethroughButton from "./plugins/ToolbarPlugin/components/StrikethroughButton";
import UndoButton from "./plugins/ToolbarPlugin/components/UndoButton";
import RedoButton from "./plugins/ToolbarPlugin/components/RedoButton";
import AlignLeftButton from "./plugins/ToolbarPlugin/components/AlignLeftButton";
import AlignCenterButton from "./plugins/ToolbarPlugin/components/AlignCenterButton";
import AlignJustifyButton from "./plugins/ToolbarPlugin/components/AlignJustifyButton";
import AlignRightButton from "./plugins/ToolbarPlugin/components/AlignRightButton";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import BlockFormatDropdown from "./plugins/ToolbarPlugin/components/BlockFormatDropdown";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import InlineCodeButton from "./plugins/ToolbarPlugin/components/InlineCodeButton";
import InsertLinkButton from "./plugins/ToolbarPlugin/components/InsertLinkButton";
import UploadImageButton from "./plugins/ToolbarPlugin/components/UploadImageButton";
import { LinkNode } from "./plugins/lexical-link";
import { LinkPlugin } from "./plugins/lexical-link/LinkPlugin";
import { FloatingLinkPlugin } from "./plugins/lexical-link/FloatingLinkPlugin";
import { UploadNode } from "./plugins/lexical-upload";
import { UploadPlugin } from "./plugins/lexical-upload/LexicalUploadPlugin";
import "./index.scss";

// When the editor changes, you can get notified via the LexicalOnChangePlugin!
// import {$getRoot, $getSelection} from 'lexical';
// function onChange(editorState) {
//     editorState.read(() => {
//         // Read the contents of the EditorState here.
//         const root = $getRoot();
//         const selection = $getSelection();
//
//         console.log(root, selection);
//     });
// }

// Lexical React plugins are React components, which makes them  highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you actually use them.
// import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
// function MyCustomAutoFocusPlugin() {
//     const [editor] = useLexicalComposerContext();
//
//     useEffect(() => {
//         // Focus the editor when the effect fires!
//         editor.focus();
//     }, [editor]);
//
//     return null;
// }

function RichTextEditor({
  initialJsonString,
  placeholder = "Enter some rich text...",
  onChange,
}: {
  initialJsonString?: string;
  placeholder?: string;
  onChange: (jsonString: string) => void;
}) {
  const initialConfig = {
    namespace: "Node Replacement Demo",
    theme: DefaultTheme,
    editorState: initialJsonString,
    nodes: [
      ParagraphNode,
      TextNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      LinkNode,
      // AutoLinkNode,
      UploadNode,
      // CustomParagraphNode,
      // {
      //     replace: ParagraphNode,
      //     with: () => $createCustomParagraphNode(),
      //     withKlass: CustomParagraphNode,
      // },
    ],
    onError(error: Error) {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="rich-text-editor-container">
        <ToolbarPlugin>
          <UndoButton />
          <RedoButton />
          <div className="rich-text-editor-toolbar__divider" />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <StrikethroughButton />
          <InlineCodeButton />
          <InsertLinkButton />
          <div className="rich-text-editor-toolbar__divider" />
          <AlignLeftButton />
          <AlignCenterButton />
          <AlignRightButton />
          <AlignJustifyButton />
          <div className="rich-text-editor-toolbar__divider" />
          <UploadImageButton />
          <div className="rich-text-editor-toolbar__divider" />
          <BlockFormatDropdown />
        </ToolbarPlugin>
        <div className="rich-text-editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="rich-text-editor-inner__input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="rich-text-editor-inner__placeholder">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <FloatingLinkPlugin />
          <UploadPlugin />
          <CheckListPlugin />
          <OnChangePlugin
            onChange={(editorState) => {
              console.log("editorState", editorState.toJSON());
              onChange(JSON.stringify(editorState.toJSON()));
            }}
          />

          {/*<ClearEditorPlugin />*/}
          {/* <SpeechToTextPlugin /> */}
          {/*<MyCustomAutoFocusPlugin />*/}
        </div>
      </div>
    </LexicalComposer>
  );
}

export default RichTextEditor;
