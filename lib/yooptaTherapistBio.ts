import {
      deserializeHTML,
      type YooEditor,
      type YooptaContentValue,
} from '@yoopta/editor';
import Paragraph from '@yoopta/paragraph';
import { HeadingOne, HeadingTwo, HeadingThree } from '@yoopta/headings';
import { BulletedList, NumberedList } from '@yoopta/lists';
import { Bold, Italic, Strike, Underline } from '@yoopta/marks';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

export const therapistBioPlugins = [
      Paragraph,
      HeadingOne,
      HeadingTwo,
      HeadingThree,
      BulletedList,
      NumberedList,
];

export const therapistBioMarks = [
      Bold,
      Italic,
      Underline,
      Strike,
];

export const therapistBioTools = {
      Toolbar: {
            tool: Toolbar,
            render: DefaultToolbarRender,
      },
      ActionMenu: {
            tool: ActionMenuList,
            render: DefaultActionMenuRender,
      },
      LinkTool: {
            tool: LinkTool,
            render: DefaultLinkToolRender,
      },
};

function escapeHtml(value: string): string {
      return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

function parsePotentialJson(value: unknown): unknown {
      if (typeof value !== 'string') {
            return value;
      }

      try {
            return JSON.parse(value);
      } catch {
            return null;
      }
}

export function normalizeTherapistBioContent(value: unknown): YooptaContentValue | null {
      const candidate = parsePotentialJson(value);

      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
            return null;
      }

      if (Object.keys(candidate).length === 0) {
            return null;
      }

      return candidate as YooptaContentValue;
}

export function createTherapistBioContentFromPlainText(
      editor: YooEditor,
      plainText: string,
): YooptaContentValue | null {
      if (typeof document === 'undefined') {
            return null;
      }

      const normalizedText = plainText.trim();
      if (!normalizedText) {
            return null;
      }

      const paragraphHtml = normalizedText
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter((paragraph) => paragraph.length > 0)
            .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
            .join('');

      if (!paragraphHtml) {
            return null;
      }

      const container = document.createElement('div');
      container.innerHTML = paragraphHtml;

      const blocks = deserializeHTML(editor, container);
      if (!Array.isArray(blocks) || blocks.length === 0) {
            return null;
      }

      return blocks.reduce<YooptaContentValue>((accumulator, block) => {
            accumulator[block.id] = block;
            return accumulator;
      }, {});
}

export function getTherapistBioPlainText(
      editor: YooEditor,
      content: YooptaContentValue | null | undefined,
): string {
      if (!content) {
            return '';
      }

      return editor.getPlainText(content).trim();
}
