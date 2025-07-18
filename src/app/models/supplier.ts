export interface Supplier {
    id: string;
    name: string;
    product: string;
    category: string;
    price: number;
    contact: string;
    email: string;
    returnPolicy: 'yes' | 'no';
    dateAdded: Date;
    password?: string; // Add password as optional field

}
