export const PURCHASE = [
  { title: 'Purchases', route: 'purchases' },
  {
    title: 'Fibre',
    submenu: [
      { title: 'Search Fibre PO', route: 'purchases/fibre/search' },
      {
        title: 'New Fibre PO',
        route: 'purchases/fibre/new-purchase-order',
      },
      {
        title: 'Receive Fibre PO',
        route: 'purchases/fibre/receive-purchase-order',
      },
    ],
  },
];
