import { createContext } from "react";
import { BLOCK_TYPE_DEFAULT } from "../constants";

interface IToolbarContext {
  // isRTL: boolean;
  canUndo: boolean;
  canRedo: boolean;

  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;

  isLink: boolean;
  isUploadImage: boolean;

  isAlignLeft: boolean;
  isAlignCenter: boolean;
  isAlignRight: boolean;
  isAlignJustify: boolean;

  blockType: string;

  // isSubscript: boolean;
  // isSuperscript: boolean;
  // fontFamily: string;
  // fontSize: string;
  // fontColor: string;
  // bgColor: string;
  // codeLanguage: string;
  // selectedElementKey: string;
  // applyStyleText: (styles: Record<string, string>) => void;
  // insertLink: () => void;
}

const defaultState: IToolbarContext = {
  canUndo: false,
  canRedo: false,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  isLink: false,
  isUploadImage: false,
  isAlignLeft: false,
  isAlignCenter: false,
  isAlignRight: false,
  isAlignJustify: false,
  blockType: BLOCK_TYPE_DEFAULT,
};

const ToolbarContext = createContext<IToolbarContext>(defaultState);

export default ToolbarContext;
