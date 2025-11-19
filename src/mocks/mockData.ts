import { Product, CartItem } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop HP Pavilion",
    price: 599990,
    image: "https://images.unsplash.com/photo-1554126343-12e9cd58e25c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    stock: 5,
    category: "Computadores",
    description: "Laptop HP con procesador Intel Core i5"
  },
  {
    id: 2,
    name: "Mouse Logitech G502",
    price: 45990,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1028",
    stock: 0,
    category: "Accesorios",
    description: "Mouse gaming con sensor HERO"
  },
  {
    id: 3,
    name: "Teclado Mecánico",
    price: 89990,
    image: "https://images.unsplash.com/photo-1606075014584-5ccf554b50db?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632",
    stock: 10,
    category: "Accesorios",
    description: "Teclado mecánico RGB retroiluminado"
  },
  {
    id: 4,
    name: "Monitor Samsung 24\"",
    price: 189990,
    image: "https://images.unsplash.com/photo-1547119957-637f8679db1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    stock: 3,
    category: "Monitores",
    description: "Monitor Full HD IPS 75Hz"
  },
  {
    id: 5,
    name: "Webcam Logitech C920",
    price: 79990,
    image: "https://images.unsplash.com/photo-1626581795188-8efb9a00eeec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735",
    stock: 8,
    category: "Accesorios",
    description: "Webcam HD 1080p con micrófono estéreo"
  },
  {
    id: 6,
    name: "Auriculares Sony WH-1000XM4",
    price: 299990,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688",
    stock: 6,
    category: "Audio",
    description: "Auriculares con cancelación de ruido"
  }
];

export const mockCart: CartItem[] = [
  {
    id: 1,
    name: "Laptop HP Pavilion",
    price: 599990,
    image: "https://images.unsplash.com/photo-1554126343-12e9cd58e25c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    stock: 5,
    category: "Computadores",
    quantity: 1
  }
];