const renderLogo = (pointCount = 3, container = null, backgroundColor = '#fff', foregroundColor = '#000') => {
  const xmlns = "http://www.w3.org/2000/svg";
  let svg;

  if (typeof document !== 'undefined') {
    // Client-side execution
    svg = document.createElementNS(xmlns, 'svg');
  } else {
    // Server-side execution
    svg = {
      tagName: 'svg',
      attributes: {
        xmlns: xmlns
      },
      children: [],
      setAttributeNS(_, name, value) {
        this.attributes[name] = value;
      },
      appendChild(child) {
        this.children.push(child);
      },
      append(...children) {
        this.children.push(...children);
      }
    };
  }

  const createElementNS = (xmlns, tagName) => {
    if (typeof document !== 'undefined') {
      return document.createElementNS(xmlns, tagName);
    } else {
      return {
        tagName,
        attributes: {},
        children: [],
        setAttributeNS(_, name, value) {
          this.attributes[name] = value;
        },
        appendChild(child) {
          this.children.push(child);
        }
      };
    }
  };

  const serializeNode = (node) => {
    if (typeof document !== 'undefined') {
      return node.outerHTML;
    } else {
      const attrs = Object.entries(node.attributes).map(([k, v]) => `${k}="${v}"`).join(' ');
      if (node.children.length === 0) {
        return `<${node.tagName} ${attrs}></${node.tagName}>`;
      }
      const children = node.children.map(serializeNode).join('\n  ');
      return `<${node.tagName} ${attrs}>\n  ${children}\n</${node.tagName}>`;
    }
  };

  const points = Array.from(Array(pointCount).keys());
  const size = 300;
  const margin = size / 2;
  const width = size + margin;
  const height = size + margin;
  const px = (i) => width / 2 + (size / 2) * Math.sin(2 * Math.PI * i / pointCount);
  const py = (i) => height / 2 - (size / 2) * Math.cos(2 * Math.PI * i / pointCount);

  svg.setAttributeNS(null, 'width', width);
  svg.setAttributeNS(null, 'height', height);
  svg.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`);

  const outerCircles = points.map((i) => {
    const cx = px(i);
    const cy = py(i);
    const circle = createElementNS(xmlns, 'circle');
    circle.setAttributeNS(null, 'cx', cx);
    circle.setAttributeNS(null, 'cy', cy);
    circle.setAttributeNS(null, 'r', size / 5);
    circle.setAttributeNS(null, 'fill', foregroundColor);
    circle.setAttributeNS(null, 'stroke', 'none');
    return circle;
  });
  outerCircles.forEach(circle => svg.appendChild(circle));

  const outerPolygon = createElementNS(xmlns, 'path');
  outerPolygon.setAttributeNS(null, 'd', `M ${points.map((i) => `${px(i)} ${py(i)}`).join(' L ')} Z`);
  outerPolygon.setAttributeNS(null, 'fill', backgroundColor);
  outerPolygon.setAttributeNS(null, 'stroke', 'none');
  svg.appendChild(outerPolygon);

  const innerPolygon = createElementNS(xmlns, 'path');
  innerPolygon.setAttributeNS(null, 'd', `M ${points.map((i) => `${px(i)} ${py(i)}`).join(' L ')} Z`);
  innerPolygon.setAttributeNS(null, 'fill', foregroundColor);
  innerPolygon.setAttributeNS(null, 'stroke', 'none');
  innerPolygon.setAttributeNS(null, 'transform', `scale(0.5) translate(${width / 2},${height / 2})`);
  svg.appendChild(innerPolygon);

  const centerCircle = createElementNS(xmlns, 'circle');
  centerCircle.setAttributeNS(null, 'cx', width / 2);
  centerCircle.setAttributeNS(null, 'cy', height / 2);
  centerCircle.setAttributeNS(null, 'r', size / 10);
  centerCircle.setAttributeNS(null, 'fill', backgroundColor);
  centerCircle.setAttributeNS(null, 'stroke', 'none');
  svg.appendChild(centerCircle);

  if (container) {
    container.innerHTML = '';
    container.appendChild(svg);
  }

  // If running server-side, serialize the SVG and return as string
  if (typeof document === 'undefined') {
    return serializeNode(svg);
  }

  return svg;
};

if (typeof document !== 'undefined') {
  const container = document.getElementById('logo-container')

  let currentPointCount = 3
  const countdown = (i, duration, increment = 1) => {
    if (i < 3 || i > 30) return;
    currentPointCount = i
    renderLogo(i, container)
    setTimeout(() => {
      countdown(i - increment, duration, increment)
    }, duration)
  }
  renderLogo(6, container)
  setTimeout(() => {
    countdown(6, 100)
  }, 1000)

  container.addEventListener('click', () => {
    if (currentPointCount < 9) {
      currentPointCount++
      renderLogo(currentPointCount, container)
    } else {
      countdown(9, 100)
    }
  })
} else {
  exports.renderLogo = renderLogo;
}
