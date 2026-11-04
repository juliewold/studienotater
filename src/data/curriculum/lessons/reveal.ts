import { Children, createContext, type ComponentType, type ReactElement, type ReactNode } from "react";

// Building figures and code up step by step. The lecture player sets how many parts are
// visible; everywhere else (the topic page) the default shows all of them.

/** Number of visible parts of the figure or code block being rendered. */
export const RevealContext = createContext(Infinity);

/**
 * Number of parts a figure is built from, which are the children of its `Svg`. Figures are
 * plain functions without hooks, so their element tree can be read without rendering them.
 */
export function figureParts(component: ComponentType): number {
  const root = (component as unknown as () => ReactElement<{ children?: ReactNode }>)();
  return Children.toArray(root.props.children).length;
}
