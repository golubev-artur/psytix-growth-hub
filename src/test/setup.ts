import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// jsdom не реализует эти API, а компоненты (framer-motion, recharts, автоскролл чата)
// вызывают их при монтировании.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

Object.defineProperty(window, "IntersectionObserver", { writable: true, value: MockObserver });
Object.defineProperty(window, "ResizeObserver", { writable: true, value: MockObserver });
Object.defineProperty(globalThis, "IntersectionObserver", { writable: true, value: MockObserver });
Object.defineProperty(globalThis, "ResizeObserver", { writable: true, value: MockObserver });

Element.prototype.scrollIntoView = () => {};
window.scrollTo = () => {};
