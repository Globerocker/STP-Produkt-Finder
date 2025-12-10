declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const trackEvent = (eventName: string, eventData: Record<string, any>): void => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });
  console.log(`GTM Event: ${eventName}`, eventData); // For debugging
};
