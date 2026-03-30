import React from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {
  content: string;
};

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="markdown">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
