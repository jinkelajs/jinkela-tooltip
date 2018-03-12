{
  class Tooltip extends Jinkela {
    get template() {
      return `
        <div>
          <meta ref="content" />
        </div>
      `;
    }
    popup(target, content) {
      this.content = content;
      let rect = target.getBoundingClientRect();
      this.element.style.left = (rect.left + rect.right) / 2 + 'px';
      this.element.style.top = rect.bottom + 'px';
      this.to(document.body);
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

  let tooltip = new Tooltip();

  Jinkela.register({
    pattern: /^tooltip$/,
    priority: 100,
    handler: (that, node, ownerElement) => {
      if (ownerElement.component) ownerElement = ownerElement.component.element;
      let content = node.value;
      ownerElement.addEventListener('mouseenter', () => {
        tooltip.popup(ownerElement, content);
      });
      ownerElement.addEventListener('mouseleave', () => {
        tooltip.destroy(); // TODO: Fade out
      });
      node['@@subscribers'].push(() => {
        content = node.jinkelaValue;
      });
    }
  });
}
