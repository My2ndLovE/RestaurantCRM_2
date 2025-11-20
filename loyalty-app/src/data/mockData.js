import banner1 from '../assets/images/banner-1.jpg';
import banner2 from '../assets/images/banner-2.jpg';
import banner3 from '../assets/images/banner-3.jpg';
import banner4 from '../assets/images/banner-4.jpg';
import subBanner1 from '../assets/images/sub-banner-1.jpg';
import subBanner2 from '../assets/images/sub-banner-2.jpg';
import product1 from '../assets/images/product-1.jpg';
import product2 from '../assets/images/product-2.jpg';
import product3 from '../assets/images/product-3.jpg';
import logo from '../assets/images/logo-1.png';

export const brandAssets = {
    logo,
    banner1,
    banner2,
    banner3,
    banner4,
    subBanner1,
    subBanner2
};

export const currentUser = {
    name: "Alex Johnson",
    points: 1250,
    tier: "Potato Lover",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    nextReward: 1500,
};

export const activeOffers = [
    {
        id: 1,
        title: "Signature Shake Fries",
        description: "Get 2x points on all Shake Fries today!",
        image: product1,
        expires: "2h left",
        type: "promo",
        pointsCost: 0 // Promo, usually free or just an event
    },
    {
        id: 2,
        title: "Free Cheese Dip",
        description: "Buy any Mega Fries, get free cheese sauce.",
        image: product2,
        expires: "1d left",
        type: "voucher",
        pointsCost: 200
    },
    {
        id: 3,
        title: "Family Combo Deal",
        description: "3 Large Fries + 3 Drinks for $15.",
        image: product3,
        expires: "3d left",
        type: "bundle",
        pointsCost: 1500
    }
];

export const transactionHistory = [
    { id: 1, type: 'earn', description: 'Lunch at Downtown Branch', points: 150, date: '2023-10-25' },
    { id: 2, type: 'redeem', description: 'Free Iced Coffee', points: -500, date: '2023-10-24' },
    { id: 3, type: 'game', description: 'Won in Spin the Wheel', points: 50, date: '2023-10-23' },
    { id: 4, type: 'earn', description: 'Dinner with Friends', points: 320, date: '2023-10-20' },
];

export const myVouchers = [
    { id: 101, title: 'Free Iced Coffee', code: 'COFFEE-123', expires: '2023-11-01', status: 'active' },
    { id: 102, title: '$5 Off Total Bill', code: 'SAVE5-999', expires: '2023-11-15', status: 'active' },
    { id: 103, title: 'Free Donut', code: 'DONUT-000', expires: '2023-10-20', status: 'expired' },
];
