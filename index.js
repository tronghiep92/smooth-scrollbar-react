import React from 'react';
import PropTypes from 'prop-types';
import SmoothScrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
SmoothScrollbar.use(OverscrollPlugin);

class Scrollbar extends React.Component {
  static propTypes = {
    damping: PropTypes.number,
    thumbMinSize: PropTypes.number,
    syncCallbacks: PropTypes.bool,
    renderByPixels: PropTypes.bool,
    alwaysShowTracks: PropTypes.bool,
    continuousScrolling: PropTypes.bool,
    plugins: PropTypes.object,
    onScroll: PropTypes.func,
    children: PropTypes.node,
    innerRef: PropTypes.func,
  };

  static defaultProps = {
    innerRef: () => {},
  };

  componentDidMount() {
    this.scrollbar = SmoothScrollbar.init(this.container);

    this.scrollbar.addListener(this.handleScroll.bind(this));

    this.props.innerRef(this.scrollbar);
  }

  componentWillReceiveProps(nextProps) {
    Object.keys(nextProps).forEach(key => {
      if (!key in this.scrollbar.options) {
        return;
      }

      if (key === 'plugins') {
        Object.keys(nextProps.plugins).forEach(pluginName => {
          this.scrollbar.updatePluginOptions(
            pluginName,
            nextProps.plugins[pluginName]
          );
        });
      } else {
        this.scrollbar.options[key] = nextProps[key];
      }
    });
  }

  componentDidUpdate(prevProps) {
    this.scrollbar && this.scrollbar.update();
  }

  componentWillUnmount() {
    if (this.scrollbar) {
      this.scrollbar.destroy();
    }
  }

  handleScroll(status) {
    if (this.props.onScroll) {
      this.props.onScroll(status, this.scrollbar);
    }
  }

  render() {
    const { children } = this.props;

    const count = React.Children.count(children);

    return count === 1 && typeof children.type === 'string'
      ? React.cloneElement(children, {
          ref: node => (this.container = node),
        })
      : React.createElement(
          'div',
          {
            ref: node => (this.container = node),
            style: {
              WebkitBoxFlex: 1,
              msFlex: 1,
              MozFlex: 1,
              flex: 1,
            },
          },
          children
        );
  }
}

export default Scrollbar;