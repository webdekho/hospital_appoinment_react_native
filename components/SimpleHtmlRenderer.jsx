import React from 'react';
import { Text, View } from 'react-native';

const SimpleHtmlRenderer = ({ html, style, fallbackText }) => {
  console.log('SimpleHtmlRenderer - Raw HTML:', html);
  
  if (!html) {
    return <Text style={style}>{fallbackText || 'No content available.'}</Text>;
  }

  // Simple HTML to React Native Text converter
  const parseHtml = (htmlString) => {
    // First, unescape any escaped slashes and quotes
    let text = htmlString
      // Unescape forward slashes
      .replace(/\\\//gi, '/')
      // Unescape quotes
      .replace(/\\"/gi, '"')
      .replace(/\\'/gi, "'")
      // Replace paragraph tags with line breaks
      .replace(/<p[^>]*>/gi, '')
      .replace(/<\/p>/gi, '\n\n')
      // Replace break tags with line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<br[^>]*>/gi, '\n')
      // Handle bold and strong tags - remove but keep content
      .replace(/<b[^>]*>/gi, '')
      .replace(/<\/b>/gi, '')
      .replace(/<strong[^>]*>/gi, '')
      .replace(/<\/strong>/gi, '')
      // Handle italic and emphasis tags
      .replace(/<i[^>]*>/gi, '')
      .replace(/<\/i>/gi, '')
      .replace(/<em[^>]*>/gi, '')
      .replace(/<\/em>/gi, '')
      // Handle heading tags
      .replace(/<h[1-6][^>]*>/gi, '')
      .replace(/<\/h[1-6]>/gi, '\n')
      // Handle list items
      .replace(/<li[^>]*>/gi, '• ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\n')
      // Handle div tags
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '\n')
      // Replace line break entities
      .replace(/&nbsp;/gi, ' ')
      // Replace common HTML entities
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&#8217;/gi, "'") // Right single quotation mark
      .replace(/&#8220;/gi, '"') // Left double quotation mark
      .replace(/&#8221;/gi, '"') // Right double quotation mark
      // Remove any remaining HTML tags
      .replace(/<[^>]*>/gi, '')
      // Clean up multiple line breaks
      .replace(/\n\s*\n\s*\n/gi, '\n\n')
      // Clean up multiple spaces
      .replace(/\s+/gi, ' ')
      // Trim whitespace
      .trim();

    return text;
  };

  // Check if content contains HTML tags
  const containsHtml = /<[^>]*>/.test(html);

  if (!containsHtml) {
    // If no HTML tags, just display as plain text
    return <Text style={style}>{html}</Text>;
  }

  // Parse HTML and render as text
  const parsedText = parseHtml(html);
  console.log('SimpleHtmlRenderer - Parsed text:', parsedText);

  return (
    <Text style={style}>
      {parsedText || fallbackText || 'No content available.'}
    </Text>
  );
};

export default SimpleHtmlRenderer;