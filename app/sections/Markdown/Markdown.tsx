import {Markdown as MarkdownComp} from '~/components';
import {Schema} from './Markdown.schema';

interface MarkdownProps {
  centerAllText: boolean;
  content: string;
  section: {
    maxWidth: string;
  };
}

export function Markdown({cms}: {cms: MarkdownProps}) {
  const {centerAllText, content, section} = cms;

  return (
    <div className="px-contained py-contained">
      <div className={`mx-auto ${section?.maxWidth}`}>
        <MarkdownComp centerAllText={centerAllText}>{content}</MarkdownComp>
      </div>
    </div>
  );
}

Markdown.displayName = 'Markdown';
Markdown.Schema = Schema;
