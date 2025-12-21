import { ReactNode, Fragment, useMemo } from 'react';

type Replacements = Record<string, ReactNode>;

export function useReplaceWithNode(
  text: string,
  replacements: Replacements
): ReactNode {
  return useMemo(() => {
    const regex = /\{(\w+)\}/g;
    const parts: ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let keyIndex = 0;

    while ((match = regex.exec(text)) !== null) {
      // Add text before the placeholder
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const placeholder = match[1];
      const replacement = replacements[placeholder];

      if (replacement !== undefined) {
        parts.push(<Fragment key={keyIndex++}>{replacement}</Fragment>);
      } else {
        parts.push(match[0]);
      }

      lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return <>{parts}</>;
  }, [text, replacements]);
}
