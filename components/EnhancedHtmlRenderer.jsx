import React from 'react';
import { Text, View } from 'react-native';

const EnhancedHtmlRenderer = ({ html, style, fallbackText }) => {
  console.log('EnhancedHtmlRenderer - Raw HTML:', html);
  
  if (!html) {
    return <Text style={style}>{fallbackText || 'No content available.'}</Text>;
  }

  // Function to parse HTML and return React Native Text components
  const parseHtmlToComponents = (htmlString) => {
    // First, unescape any escaped slashes and quotes
    let processedHtml = htmlString
      .replace(/\\\//gi, '/')
      .replace(/\\"/gi, '"')
      .replace(/\\'/gi, "'");

    console.log('Processing HTML:', processedHtml);

    // Split by HTML tags to process each part
    const parts = [];
    let currentIndex = 0;
    let partIndex = 0;

    // Simple regex to find HTML tags and text content
    const htmlRegex = /<(\/?)(b|strong|i|em|p|br|div|h[1-6]|ul|ol|li)([^>]*)>([^<]*)/gi;
    let match;
    let lastIndex = 0;

    // Process the HTML string
    while ((match = htmlRegex.exec(processedHtml)) !== null) {
      // Add text before the tag
      const textBefore = processedHtml.substring(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({
          type: 'text',
          content: textBefore,
          key: `text-${partIndex++}`
        });
      }

      const isClosingTag = match[1] === '/';
      const tagName = match[2].toLowerCase();
      const content = match[4] || '';

      if (!isClosingTag && content) {
        parts.push({
          type: tagName,
          content: content,
          key: `${tagName}-${partIndex++}`
        });
      }

      lastIndex = htmlRegex.lastIndex;
    }

    // Add remaining text
    const remainingText = processedHtml.substring(lastIndex);
    if (remainingText.trim()) {
      parts.push({
        type: 'text',
        content: remainingText,
        key: `text-${partIndex++}`
      });
    }

    console.log('Parsed parts:', parts);

    // Convert parts to React components
    return parts.map((part) => {
      const cleanContent = part.content
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/<[^>]*>/gi, '') // Remove any remaining HTML tags
        .trim();

      if (!cleanContent) return null;

      switch (part.type) {
        case 'b':
        case 'strong':
          return (
            <Text key={part.key} style={[style, { fontWeight: 'bold' }]}>
              {cleanContent}
            </Text>
          );
        case 'i':
        case 'em':
          return (
            <Text key={part.key} style={[style, { fontStyle: 'italic' }]}>
              {cleanContent}
            </Text>
          );
        case 'p':
          return (
            <Text key={part.key} style={style}>
              {cleanContent}{'\n\n'}
            </Text>
          );
        case 'br':
          return <Text key={part.key}>{'\n'}</Text>;
        case 'li':
          return (
            <Text key={part.key} style={style}>
              {'• '}{cleanContent}{'\n'}
            </Text>
          );
        default:
          return (
            <Text key={part.key} style={style}>
              {cleanContent}
            </Text>
          );
      }
    }).filter(Boolean);
  };

  // Check if content contains HTML tags
  const containsHtml = /<[^>]*>/.test(html);

  if (!containsHtml) {
    // If no HTML tags, just display as plain text
    return <Text style={style}>{html}</Text>;
  }

  try {
    const components = parseHtmlToComponents(html);
    
    if (components && components.length > 0) {
      return <View>{components}</View>;
    } else {
      // Fallback to simple text parsing
      const simpleText = html
        .replace(/\\\//gi, '/')
        .replace(/<[^>]*>/gi, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .trim();
      
      return <Text style={style}>{simpleText || fallbackText}</Text>;
    }
  } catch (error) {
    console.log('Error parsing HTML:', error);
    // Fallback to simple text
    const simpleText = html
      .replace(/\\\//gi, '/')
      .replace(/<[^>]*>/gi, '')
      .replace(/&nbsp;/gi, ' ')
      .trim();
    
    return <Text style={style}>{simpleText || fallbackText}</Text>;
  }
};

export default EnhancedHtmlRenderer;