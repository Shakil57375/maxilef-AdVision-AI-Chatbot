import DOMPurify from 'dompurify';
import { marked } from 'marked';

export function formatText(content) {
  // Configure marked to leave raw HTML intact and parse Markdown
  marked.setOptions({
    gfm: true, // GitHub-flavored Markdown
    breaks: true, // Allow line breaks
    smartLists: true, // Better list formatting
  });

  const rawHtml = marked(content); // Convert Markdown to HTML
  return DOMPurify.sanitize(rawHtml); // Sanitize the HTML
}
