import * as React from 'react';

/** Renders the mini markdown used by blog posts (headings, bullet lists, numbered lists, paragraphs). */
export function PostBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const out: React.ReactNode[] = [];
  blocks.forEach((b, i) => {
    if (b.startsWith('## ')) {
      out.push(<h2 key={i}>{b.slice(3)}</h2>);
    } else if (/^- /.test(b)) {
      out.push(<ul key={i}>{b.split('\n').map((l, j) => <li key={j}>{l.replace(/^- /, '')}</li>)}</ul>);
    } else if (/^\d+\. /.test(b)) {
      out.push(<ol key={i}>{b.split('\n').map((l, j) => <li key={j}>{l.replace(/^\d+\. /, '')}</li>)}</ol>);
    } else {
      out.push(<p key={i}>{b}</p>);
    }
  });
  return <div className="prose-clay">{out}</div>;
}
