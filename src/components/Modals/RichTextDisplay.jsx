import React from 'react';
import { formatText } from '../../utils/formatText';
import "./RichTextDisplay.css"
export const RichTextDisplay = ({ content }) => {
  const formattedContent = formatText(content); // Process the content

  return (
    <div
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: formattedContent }} // Inject the sanitized HTML
    />
  );
};
