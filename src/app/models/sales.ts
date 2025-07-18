export interface SalesPerson {
    id: string;
    name: string;
    contact: string;
    email: string;
    password: string;
    dateAdded: Date;
    salesTarget?: number;
    currentSales?: number;
    performanceRating?: number;
}