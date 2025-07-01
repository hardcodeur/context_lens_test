class Graph extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._data = null;
  }

  connectedCallback() {
    this.render();
    if (this.hasAttribute('data-graphe')) {
      this._data = JSON.parse(this.getAttribute('data-graphe'));
      this.createGraph();
    }
  }

  static get observedAttributes() {
    return ['data-graphe'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-graphe' && oldValue !== newValue) {
      this._data = JSON.parse(newValue);
      this.createGraph();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        
        #graph-container {
          width: 100%;
          height: 80vh;
          border: 1px solid #ffffff;
          border-radius: 8px;
          overflow: hidden;
        }

        .node {
          width: 80%; 
          height: 80%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          text-align: center; 
          word-wrap: break-word; 
          padding: 0.5rem;
          border-radius: 100%;
          border: 1px solid #333;
          text-transform: capitalize;
        }

        .node-main {
          background-color: #6366F1 ;
          color: #FFFFFF
        }

        .node-secondary {
          background-color: #2d94e3 ;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 2s;
        }

        .node:hover {
          zoom : 110%
        }

        .link {
          stroke: #FFFFFF;
          stroke-width: 1.5px;
        }

        #modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.7);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }

        #modal-content {
          background-color: #1E1E2D;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          color : #FFFFFF
        }

        #close-modal {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #FFFFFF
        }

        #modal-title {
          margin-top: 0;
          color: #FFFFFF;
        }

        #modal-url {
          color: #3498db;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 15px;
        }

        #modal-url:hover {
          text-decoration: underline;
        }

        #modal-content-text{
          line-height: 1.5rem;
        }
      </style>

      <div id="graph-container"></div>
      
      <div id="modal">
        <div id="modal-content">
          <button id="close-modal">&times;</button>
          <h2 id="modal-title"></h2>
          <a id="modal-url" href="#" target="_blank"></a>
          <p id="modal-content-text"></p>
        </div>
      </div>
    `;
  }

  createGraph() {
    const container = this.shadowRoot.getElementById('graph-container');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    container.innerHTML = '';
    container.appendChild(svg);

    // Modal elements
    const modal = this.shadowRoot.getElementById('modal');
    const modalTitle = this.shadowRoot.getElementById('modal-title');
    const modalUrl = this.shadowRoot.getElementById('modal-url');
    const modalContent = this.shadowRoot.getElementById('modal-content-text');
    const closeModal = this.shadowRoot.getElementById('close-modal');

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    const showModal = (node) => {
      modalTitle.textContent = node.label;
      modalUrl.textContent = node.url;
      modalUrl.href = node.url;
      modalContent.textContent = node.content;
      modal.style.display = 'flex';
    };

    const width = container.clientWidth;
    const height = container.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // main node
    const mainNodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    mainNodeGroup.setAttribute('transform', `translate(${centerX - 70},${centerY - 70})`);
    mainNodeGroup.setAttribute('width', '10rem');
    mainNodeGroup.setAttribute('height', '10rem');

    const mainNode = document.createElement("div");
    mainNode.classList.add("node", "node-main");
    mainNode.innerHTML = this._data.main_node.label;
    mainNodeGroup.appendChild(mainNode);
    
    svg.appendChild(mainNodeGroup);
    
    // secondary nodes
    this._data.nodes.forEach((node, index) => {
      const angle = (index / this._data.nodes.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
  
      const nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      nodeGroup.setAttribute('width', '10rem');
      nodeGroup.setAttribute('height', '10rem');
      nodeGroup.setAttribute('transform', `translate(${x - 70},${y - 70})`);
      nodeGroup.dataset.nodeId = node.id;

      const nodeElt = document.createElement("div");
      nodeElt.classList.add("node", "node-secondary");
      nodeElt.innerHTML = node.label;
      nodeElt.addEventListener('click', () => showModal(node));
      nodeGroup.appendChild(nodeElt);
                                      
      svg.appendChild(nodeGroup);
      
      // links
      const link = document.createElementNS("http://www.w3.org/2000/svg", "line");
      link.setAttribute('x1', centerX);
      link.setAttribute('y1', centerY);
      link.setAttribute('x2', x);
      link.setAttribute('y2', y);
      link.setAttribute('class', 'link');
      svg.insertBefore(link, svg.firstChild);
    });

    // window resize
    const handleResize = () => {
      this.createGraph();
    };

    window.addEventListener('resize', handleResize);
    this._cleanup = () => {
      window.removeEventListener('resize', handleResize);
    };
  }

  disconnectedCallback() {
    if (this._cleanup) {
      this._cleanup();
    }
  }
}

customElements.define('result-graph', Graph);