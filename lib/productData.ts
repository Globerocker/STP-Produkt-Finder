import { Product, FeatureCategory, ProductFeature } from '../types';

export const PRODUCTS: Omit<Product, 'name' | 'description' | 'shortDescription'>[] = [
  // Anwaltskanzleien
  {
    id: 'lexolution',
    logoUrl: 'https://ik.imagekit.io/zi9ddio0x/Icon%20STP/Lexolution-DaGon.png?updatedAt=1761497134540',
    demoUrl: 'https://www.stp.one/de/produkte/lexolution'
  },
  {
    id: 'winmacs',
    logoUrl: 'https://ik.imagekit.io/zi9ddio0x/Icon%20STP/Winmacs-DaGon.png?updatedAt=1761497134536',
    demoUrl: 'https://www.stp.one/de/produkte/winmacs'
  },
  {
    id: 'advoware',
    logoUrl: 'https://ik.imagekit.io/zi9ddio0x/Icon%20STP/Advoware-DaGon.png?updatedAt=1761497134541',
    demoUrl: 'https://www.stp.one/de/produkte/advoware'
  },
  {
    id: 'winjur',
    logoUrl: 'https://ik.imagekit.io/zi9ddio0x/Icon%20STP/Winjur-DaGon.png?updatedAt=1761497134473',
    demoUrl: 'https://www.stp.one/de/produkte/winjur'
  },
   {
    id: 'amberlo',
    logoUrl: 'https://ik.imagekit.io/zi9ddio0x/Icon%20STP/Logo_Amberlo_blue%20(1).png?updatedAt=1761571787574',
    demoUrl: 'https://www.stp.one/de/produkte/amberlo'
  }
];

const p = {
    winmacs: 'winmacs', advoware: 'advoware', winjur: 'winjur', lexolution: 'lexolution', amberlo: 'amberlo'
};

// FIX: Replaced `Omit<ProductFeature, 'name'>` with a more explicit type to fix type inference issues with index signatures.
export const PRODUCT_FEATURES: { id: string; features: ({ id: string; [key: string]: boolean | string; })[] }[] = [
  {
    id: 'core_management',
    features: [
      { id: 'time_tracking', [p.winmacs]: true, [p.advoware]: true, [p.winjur]: true, [p.lexolution]: true, [p.amberlo]: true },
      { id: 'document_management', [p.winmacs]: true, [p.advoware]: true, [p.winjur]: true, [p.lexolution]: true, [p.amberlo]: true },
      { id: 'integrated_accounting', [p.winmacs]: true, [p.advoware]: true, [p.winjur]: false, [p.lexolution]: false, [p.amberlo]: true },
    ],
  },
  {
    id: 'tech_infra',
    features: [
      { id: 'cloud_hosting', [p.winmacs]: false, [p.advoware]: true, [p.winjur]: true, [p.lexolution]: true, [p.amberlo]: true },
      { id: 'mobile_app', [p.winmacs]: false, [p.advoware]: true, [p.winjur]: false, [p.lexolution]: true, [p.amberlo]: true },
      { id: 'bea_interface', [p.winmacs]: true, [p.advoware]: true, [p.winjur]: true, [p.lexolution]: true, [p.amberlo]: true },
    ],
  },
  {
    id: 'specialization',
    features: [
        { id: 'notariat_module', [p.winmacs]: true, [p.advoware]: true, [p.winjur]: false, [p.lexolution]: false, [p.amberlo]: false },
        { id: 'client_portal', [p.winmacs]: false, [p.advoware]: true, [p.winjur]: true, [p.lexolution]: true, [p.amberlo]: true },
    ]
  },
  {
    id: 'knowledge_data',
    features: [
        { id: 'advanced_dms', [p.winmacs]: true, [p.advoware]: true, [p.winjur]: false, [p.lexolution]: true, [p.amberlo]: true },
        { id: 'business_analytics', [p.winmacs]: false, [p.advoware]: false, [p.winjur]: false, [p.lexolution]: true, [p.amberlo]: true },
    ]
  },
  {
    id: 'ai',
    features: [
        { id: 'ai_integrated_addons', [p.winmacs]: false, [p.advoware]: true, [p.winjur]: false, [p.lexolution]: false, [p.amberlo]: true },
    ]
  }
];

export const PRODUCT_CALENDAR_URLS: { [key: string]: string } = {
  advoware: 'https://meetings-eu1.hubspot.com/advoware',
  winmacs: 'https://meetings-eu1.hubspot.com/winmacs',
  lexolution: 'https://meetings-eu1.hubspot.com/lexolution',
  amberlo: 'https://www.amberlo.io/ch',
  winjur: 'https://www.winjur.ch/de/demo' // Example URL, Winjur might have a different booking process
};