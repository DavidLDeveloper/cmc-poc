    marked.use({
      extensions: [{
        name: 'myCustomElement',
        level: 'block', // Or 'inline' depending on your custom element type
        start(src) { return src.match(/<my-custom-element>/)?.index; },
        tokenizer(src, tokens) {
          const rule = /^<my-custom-element>(.*?)<\/my-custom-element>/s;
          const match = rule.exec(src);
          if (match) {
            return {
              type: 'myCustomElement',
              raw: match[0],
              text: match[1]
            };
          }
        },
        renderer(token) {
          return `<div class="custom-element-wrapper">${token.text}</div>`;
        }
      }]
    });
