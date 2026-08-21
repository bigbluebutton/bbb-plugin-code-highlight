import * as React from 'react';
import { useState, useEffect } from 'react';
import { BbbPluginSdk, PluginApi } from 'bigbluebutton-html-plugin-sdk';
import hljs from 'highlight.js';
import { CodeHighlighterProps } from './types';
import 'highlight.js/styles/a11y-light.css';

const CODE_BLOCK_REGEX = /```\w+[\r\n\s]+([\s\S]*?)\n```/;
const CODE_LANGUAGE_REGEX = /```\w+/;

interface MessageIdAndCodeLanguage {
  messageId: string;
  codeLanguage: string;
  messageText: string;
}

function CodeHighlighter({ pluginUuid: uuid }: CodeHighlighterProps): React.ReactElement {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);

  const [
    chatMessagesToApplyHighlights,
    setChatIdsToApplyHighlights,
  ] = useState<MessageIdAndCodeLanguage[]>([]);
  const responseLoadedChatMessage = pluginApi.useLoadedChatMessages();

  useEffect(() => {
    if (responseLoadedChatMessage.data) {
      const messagesToHighlight = responseLoadedChatMessage.data.filter(
        (message) => message.message?.search(CODE_BLOCK_REGEX) > -1,
      ).map((message) => {
        const codeLanguageIndex = message.message.search(CODE_LANGUAGE_REGEX);
        let codeLanguage = '';
        if (codeLanguageIndex !== -1) {
          codeLanguage = CODE_LANGUAGE_REGEX.exec(message.message)?.[0].slice(3);
        }

        return {
          messageId: message.messageId,
          codeLanguage,
          messageText: message.message,
        };
      });
      setChatIdsToApplyHighlights(messagesToHighlight);
    }
  }, [responseLoadedChatMessage]);

  const chatMessagesDomElements = pluginApi.useChatMessageDomElements(chatMessagesToApplyHighlights
    .map((message) => message.messageId));

  useEffect(() => {
    chatMessagesDomElements?.map((chatMessageDomElement) => {
      const messageIdFromUi = chatMessageDomElement.getAttribute('data-chat-message-id');
      const messageFromGraphql = chatMessagesToApplyHighlights
        .find((message) => message.messageId === messageIdFromUi);

      const codeHTMLTags = chatMessageDomElement.querySelectorAll('code');

      codeHTMLTags.forEach((codeTagItem) => {
        const codeTagItemHasRendered = codeTagItem.getAttribute('code-highlight-rendered') === '1';
        if (!codeTagItemHasRendered) {
          const code = document.createElement('code');
          code.classList.add('hljs');
          code.classList.add(messageFromGraphql.codeLanguage);
          code.setAttribute('code-highlight-rendered', '1');
          const pureTextCode = codeTagItem.innerText;
          const highlightedCode = hljs
            .highlight(pureTextCode, { language: messageFromGraphql.codeLanguage }).value;
          code.innerHTML = highlightedCode;
          codeTagItem.replaceWith(code);
        }
      });
      return true;
    });
  }, [chatMessagesToApplyHighlights, chatMessagesDomElements]);
  return null;
}

export default CodeHighlighter;
