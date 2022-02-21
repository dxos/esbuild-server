/*@jsxRuntime automatic @jsxImportSource react*/
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
    children: _jsx(_createMdxContent, {})
  })) : _createMdxContent();
  function _createMdxContent() {
    const _components = Object.assign({
      h1: "h1",
      p: "p",
      pre: "pre",
      code: "code"
    }, props.components);
    return _jsxs(_Fragment, {
      children: [_jsx(_components.h1, {
        children: "Examples"
      }), "\n", _jsx(_components.p, {
        children: "To run the dev server with the examples build the package (optionally in watch mode)."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-bash",
          children: "yarn build --watch\n"
        })
      }), "\n", _jsx(_components.p, {
        children: "To run the app server."
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-bash",
          children: "cd examples\n../bin/main.js dev \n"
        })
      }), "\n", _jsx(_components.p, {
        children: "To run the storybook within the examples:"
      }), "\n", _jsx(_components.pre, {
        children: _jsx(_components.code, {
          className: "language-bash",
          children: "cd examples\n../bin/main.js book\n"
        })
      })]
    });
  }
}
export default MDXContent;
