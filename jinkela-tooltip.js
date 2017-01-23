{
  class Tooltip extends Jinkela {
    get template() {
      return `
        <div>
          <meta ref="content" />
        </div>
      `;
    }
    beforeParse(params) {
      params.content = params.content || document.createTextNode(params.correspondingElement.getAttribute('tooltip'));
    }
    init() {
      this.to(document.body);
      let rect = this.correspondingElement.getBoundingClientRect();
      this.element.style.left = (rect.left + rect.right) / 2 + 'px';
      this.element.style.top = rect.bottom + 'px';
    }
    destroy() {
      this.element.remove();
    }
    get styleSheet() {
      return `
        :scope {
          margin-top: 5px;
          position: absolute;
          padding: 4px 8px;
          font-size: 12px;
          max-width: 200px;
          color: #fff;
          background: rgba(0, 0, 0, .8);
          border-radius: 4px;
          z-index: 100;
          transform: translateX(-50%);
          animation: fade-out .1s linear;
        }
        @keyframes fade-out {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `;
    }
  }

  let tooltip;
  Jinkela.register('tooltip', (that, node, ownerElement) => {
    if (ownerElement.component) ownerElement = ownerElement.component.element;
    let content;
    ownerElement.addEventListener('mouseenter', () => {
      if (tooltip) {
        tooltip.destroy();
        tooltip = null;
      }
      tooltip = new Tooltip({ correspondingElement: ownerElement, content });
    });
    ownerElement.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.destroy();
        tooltip = null;
      }
    });
    return value => { content = value; };
  });
}
