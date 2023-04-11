export const PURCHASE = [
  { title: 'Purchases', route: 'purchases' },
  {
    title: 'Fibre',
    submenu: [
      { title: 'Search Fibre PO', route: 'purchases/fibre' },
      {
        title: 'New Fibre PO',
        route: 'purchases/fibre/fibre-new-purchase-order',
      },
      {
        title: 'Receive Fibre PO',
        route: 'purchases/fibre/fibre-receive-purchase-order',
      },
    ],
  },
];
