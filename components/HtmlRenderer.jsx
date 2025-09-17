import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const HtmlRenderer = ({ html, style, fallbackText }) => {
  // Simple HTML tag removal for fallback
  const stripHtmlTags = (htmlString) => {
    return htmlString
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim();
  };

  // Check if the content contains HTML tags
  const containsHtml = html && /<[^>]*>/.test(html);

  if (!html) {
    return (
      <Text style={style}>
        {fallbackText || 'No biography available.'}
      </Text>
    );
  }

  if (!containsHtml) {
    // If no HTML tags, just display as plain text
    return <Text style={style}>{html}</Text>;
  }

  // Create HTML content for WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #666666;
          background-color: transparent;
        }
        p {
          margin: 0 0 12px 0;
        }
        strong, b {
          font-weight: 600;
          color: #333333;
        }
        em, i {
          font-style: italic;
        }
        ul, ol {
          margin: 0 0 12px 16px;
          padding: 0;
        }
        li {
          margin-bottom: 4px;
        }
        h1, h2, h3, h4, h5, h6 {
          margin: 0 0 8px 0;
          color: #1a1a1a;
          font-weight: 600;
        }
        h1 { font-size: 18px; }
        h2 { font-size: 16px; }
        h3 { font-size: 15px; }
        h4 { font-size: 14px; }
        a {
          color: #005666;
          text-decoration: none;
        }
        br {
          line-height: 1.2;
        }
        * {
          max-width: 100%;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;

  // Calculate height based on content length (rough estimation)
  const estimatedHeight = Math.max(100, Math.min(300, html.length * 0.5 + 80));

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: htmlContent }}
        style={[styles.webview, { height: estimatedHeight }]}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={['*']}
        javaScriptEnabled={false}
        domStorageEnabled={false}
        startInLoadingState={false}
        mixedContentMode="compatibility"
        onError={() => {
          // Fallback to text if WebView fails
          console.log('WebView failed, falling back to text');
        }}
        renderError={() => (
          <Text style={[style, styles.fallbackText]}>
            {stripHtmlTags(html)}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    backgroundColor: 'transparent',
    width: '100%',
  },
  fallbackText: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
  },
});

export default HtmlRenderer;