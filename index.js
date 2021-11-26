const INPUT = {
  Items: [
    {
      name: 'oval hat',
      type: 'hats',
      prices: [
        {
          priceFor: 'regular',
          price: 20000
        },
        {
          priceFor: 'VIP',
          price: 15000
        }
      ]
    },
    {
      name: 'square hat',
      type: 'hats',
      prices: [
        {
          priceFor: 'regular',
          price: 30000
        },
        {
          priceFor: 'VIP',
          price: 20000
        },
        {
          priceFor: 'wholesale',
          price: 15000
        }
      ]
    },
    {
      name: 'magic shirt',
      type: 'tops',
      prices: [
        {
          priceFor: 'regular',
          price: 50000
        }
      ]
    }
  ],
  Buyers: [
    {
      name: 'Ani',
      type: 'regular'
    },
    {
      name: 'Budi',
      type: 'VIP'
    },
    {
      name: 'Charlie',
      type: 'regular'
    },
    {
      name: 'Dipta',
      type: 'wholesale'
    }
  ],
  Transaction: [
    {
      item: 'magic shirt',
      qty: 1,
      buyer: 'Ani'
    },
    {
      item: 'square hat',
      qty: 2,
      buyer: 'Budi'
    },
    {
      item: 'magic shirt',
      qty: 1,
      buyer: 'Ani'
    },
    {
      item: 'oval hat',
      qty: 1,
      buyer: 'Ani'
    },
    {
      item: 'square hat',
      qty: 100,
      buyer: 'Dipta'
    }
  ]
};

class Item {
  constructor(
    name,
    type,
    regularPrice,
    vipPrice = regularPrice,
    wholesalePrice = regularPrice
  ) {
    this.name = name;
    this.regularPrice = regularPrice;
    this.vipPrice = vipPrice;
    this.wholesalePrice = wholesalePrice;
    this.type = type;
    this.revenue = 0;
  }
}

class Hat extends Item {
  constructor(name, regularPrice, vipPrice, wholesalePrice) {
    super(name, 'hats', regularPrice, vipPrice, wholesalePrice);
  }
}

class Top extends Item {
  constructor(name, regularPrice, vipPrice, wholesalePrice) {
    super(name, 'tops', regularPrice, vipPrice, wholesalePrice);
  }
}

class Short extends Item {
  constructor(name, regularPrice, vipPrice, wholesalePrice) {
    super(name, 'shorts', regularPrice, vipPrice, wholesalePrice);
  }
}

class ItemFactory {
  static Item(name, type, regularPrice, vipPrice, wholesalePrice) {
    switch (type) {
      case 'hats':
        return new Hat(name, regularPrice, vipPrice, wholesalePrice);
      case 'tops':
        return new Top(name, regularPrice, vipPrice, wholesalePrice);
      case 'shorts':
        return new Short(name, regularPrice, vipPrice, wholesalePrice);
      default:
        break;
    }
  }
}

class Buyer {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.spent = 0;
  }
}

class RegularBuyer extends Buyer {
  constructor(name) {
    super(name, 'regular');
  }
}

class VIPBuyer extends Buyer {
  constructor(name) {
    super(name, 'VIP');
  }
}

class WholesaleBuyer extends Buyer {
  constructor(name) {
    super(name, 'wholesale');
  }
}

class Summary {
  constructor(
    totalTransaction,
    bestSellingItem,
    bestSellingCategory,
    rpc,
    revenue,
    bestSpenders
  ) {
    this.totalTransaction = totalTransaction;
    this.bestSellingItem = bestSellingItem;
    this.bestSellingCategory = bestSellingCategory;
    this.rpc = rpc;
    this.revenue = revenue;
    this.bestSpenders = bestSpenders;
  }
}

class BuyerFactory {
  static Buyer(name, type) {
    switch (type) {
      case 'regular':
        return new RegularBuyer(name);
      case 'VIP':
        return new VIPBuyer(name);
      case 'wholesale':
        return new WholesaleBuyer(name);
      default:
        break;
    }
  }
}

const pointOfSales = (inputArr) => {
  const checkRegularPrice = inputArr['Items'].every(
    (item) => item.prices[0].priceFor === 'regular'
  );

  if (!checkRegularPrice)
    return 'There is one or more item(s) without regular price. Please check again. No summary is printed.';

  const itemSet = new Set(inputArr.Items.map((item) => item.name));

  if (itemSet.size !== inputArr.Items.length)
    return 'There is duplicated items in the system. Please check again. No summary is printed.';

  const buyerSet = new Set(inputArr.Buyers.map((buyer) => buyer.name));

  if (buyerSet.size !== inputArr.Buyers.length)
    return 'There is duplicated buyers in the system. Please check again. No summary is printed.';

  const items = inputArr['Items'].map((item) =>
    ItemFactory.Item(
      item.name,
      item.type,
      item.prices[0]?.price,
      item.prices[1]?.price,
      item.prices[2]?.price
    )
  );

  const buyers = inputArr['Buyers'].map((buyer) =>
    BuyerFactory.Buyer(buyer.name, buyer.type)
  );

  for (let transaction of inputArr.Transaction) {
    const itemIdx = items.findIndex((item) => item.name === transaction.item);
    const item = items[itemIdx];

    const buyerIdx = buyers.findIndex(
      (buyer) => buyer.name === transaction.buyer
    );
    const buyer = buyers[buyerIdx];

    switch (buyer.type) {
      case 'regular':
        buyer.spent += item.regularPrice * transaction.qty;
        item.revenue += item.regularPrice * transaction.qty;
        break;
      case 'VIP':
        buyer.spent += item.vipPrice * transaction.qty;
        item.revenue += item.vipPrice * transaction.qty;
        break;
      case 'wholesale':
        buyer.spent += item.wholesalePrice * transaction.qty;
        item.revenue += item.wholesalePrice * transaction.qty;
        break;
      default:
        break;
    }
  }

  const totalTransaction = inputArr.Transaction.length;
  const bestSellingItem = [...items].sort((a, b) => b.revenue - a.revenue)[0]
    .name;
  const rpc = [
    { category: 'hats', revenue: 0 },
    { category: 'tops', revenue: 0 },
    { category: 'shorts', revenue: 0 }
  ];
  const bestSellingCategory = [...rpc].sort((a, b) => b.revenue - a.revenue)[0]
    .category;
  let revenue = 0;

  for (let item of items) {
    revenue += item.revenue;

    switch (item.type) {
      case 'hats':
        rpc[0].revenue += item.revenue;
        break;
      case 'tops':
        rpc[1].revenue += item.revenue;
        break;
      case 'shorts':
        rpc[2].revenue += item.revenue;
        break;
      default:
        break;
    }
  }

  const bestSpenders = [...buyers]
    .sort((a, b) => b.spent - a.spent)
    .splice(0, 3);

  const summary = new Summary(
    totalTransaction,
    bestSellingItem,
    bestSellingCategory,
    rpc,
    revenue,
    bestSpenders
  );

  return { Summary: summary };
};

console.log(pointOfSales(INPUT));
