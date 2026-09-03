import React, { useEffect, useMemo } from 'react';
import originalHtml from '../brinkalhao-pizzaria.html?raw';

const ORIGINAL_HEAD_ATTRIBUTE = 'data-original-brinkalhao-head';

function parseOriginalPage() {
  return new DOMParser().parseFromString(originalHtml, 'text/html');
}

function App() {
  const pageHtml = useMemo(() => {
    const documentHtml = parseOriginalPage();

    documentHtml.body.querySelectorAll('script').forEach((script) => script.remove());

    return documentHtml.body.innerHTML;
  }, []);

  useEffect(() => {
    const documentHtml = parseOriginalPage();
    const injectedHeadNodes = [];

    documentHtml.head.querySelectorAll('link, style').forEach((node) => {
      const clonedNode = node.cloneNode(true);
      clonedNode.setAttribute(ORIGINAL_HEAD_ATTRIBUTE, 'true');
      document.head.appendChild(clonedNode);
      injectedHeadNodes.push(clonedNode);
    });

    documentHtml.body.querySelectorAll('script').forEach((script) => {
      if (!script.textContent.trim()) return;

      const executeOriginalScript = new Function(script.textContent);
      executeOriginalScript();
    });

    return () => {
      injectedHeadNodes.forEach((node) => node.remove());
      document.body.classList.remove('modal-open');
    };
  }, []);

  return <main dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}

export default App;
